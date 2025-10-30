-- Create secure purchase processing function
CREATE OR REPLACE FUNCTION public.process_purchase(
  _buyer_id uuid,
  _product_id uuid,
  _quantity integer,
  _payment_method text
) RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _price_cents integer;
  _total_cents integer;
  _creator_id uuid;
  _stock integer;
  _balance_cents integer;
  _points integer;
  _points_required integer;
  _order_id uuid;
BEGIN
  -- Validate input
  IF _quantity <= 0 THEN
    RAISE EXCEPTION 'Invalid quantity';
  END IF;

  IF _payment_method NOT IN ('wallet', 'points', 'card') THEN
    RAISE EXCEPTION 'Invalid payment method';
  END IF;

  -- Get product details with lock
  SELECT price_cents, creator_id, stock_quantity
  INTO _price_cents, _creator_id, _stock
  FROM products
  WHERE id = _product_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Product not found';
  END IF;

  -- Validate stock
  IF _stock < _quantity THEN
    RAISE EXCEPTION 'Insufficient stock available';
  END IF;

  -- Calculate total
  _total_cents := _price_cents * _quantity;
  _points_required := CEIL((_total_cents::decimal / 100) * 100);

  -- Get and lock wallet
  SELECT balance_cents, points
  INTO _balance_cents, _points
  FROM wallets
  WHERE user_id = _buyer_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Wallet not found';
  END IF;

  -- Validate payment method and balance
  IF _payment_method = 'wallet' THEN
    IF _balance_cents < _total_cents THEN
      RAISE EXCEPTION 'Insufficient wallet balance';
    END IF;
    
    -- Deduct from wallet
    UPDATE wallets
    SET balance_cents = balance_cents - _total_cents,
        updated_at = NOW()
    WHERE user_id = _buyer_id;

  ELSIF _payment_method = 'points' THEN
    IF _points < _points_required THEN
      RAISE EXCEPTION 'Insufficient points';
    END IF;
    
    -- Deduct points
    UPDATE wallets
    SET points = points - _points_required,
        updated_at = NOW()
    WHERE user_id = _buyer_id;

  ELSIF _payment_method = 'card' THEN
    RAISE EXCEPTION 'Card payments not yet supported';
  END IF;

  -- Update product stock
  UPDATE products
  SET stock_quantity = stock_quantity - _quantity,
      updated_at = NOW()
  WHERE id = _product_id;

  -- Create order
  INSERT INTO orders (buyer_id, product_id, creator_id, quantity, total_cents, status, payment_method)
  VALUES (_buyer_id, _product_id, _creator_id, _quantity, _total_cents, 'completed', _payment_method)
  RETURNING id INTO _order_id;

  -- Return success with order details
  RETURN json_build_object(
    'success', true,
    'order_id', _order_id,
    'total_cents', _total_cents,
    'payment_method', _payment_method
  );

EXCEPTION
  WHEN OTHERS THEN
    -- Return error details
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;