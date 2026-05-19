import { useNavigate } from "react-router-dom";
import { LazySection } from "./LazySection";

const SUNSET = {
  orange: "#ff6b35",
  amber: "#f7931e",
  magenta: "#e84393",
  violet: "#6c5ce7",
};

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#0a0a0a] text-white font-body overflow-x-hidden min-h-screen">
      <span className="sr-only">
        <h1>TokMarket — The social marketplace where creators keep 90%</h1>
      </span>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* HERO */}
        <section className="text-center mb-20 sm:mb-32 relative">
          <div
            aria-hidden="true"
            className="absolute -top-10 sm:-top-20 left-1/2 w-72 sm:w-96 h-72 sm:h-96 blur-[80px] sm:blur-[120px] opacity-20 pointer-events-none"
            style={{ background: SUNSET.violet, transform: "translate3d(-50%,0,0)" }}
          />
          <div
            className="inline-block bg-white text-black font-display text-lg sm:text-2xl px-3 sm:px-4 py-1 -rotate-2 mb-6 sm:mb-8"
            style={{ boxShadow: `4px 4px 0px ${SUNSET.magenta}` }}
          >
            LIMITED SPOTS AVAILABLE
          </div>
          <div
            aria-hidden="true"
            className="font-display text-[clamp(4rem,15vw,12rem)] leading-[0.85] tracking-tighter"
          >
            <span className="block text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              STOP
            </span>
            <span
              className="block italic text-transparent bg-clip-text"
              style={{
                backgroundImage: `linear-gradient(to right, ${SUNSET.orange}, ${SUNSET.magenta}, ${SUNSET.violet})`,
              }}
            >
              START EARNING
            </span>
          </div>
          <p className="mt-6 sm:mt-8 max-w-2xl mx-auto text-base sm:text-xl text-gray-400 px-2">
            Stop giving away your content for free. You keep{" "}
            <span
              className="font-bold underline decoration-2 underline-offset-4"
              style={{ color: SUNSET.amber }}
            >
              90% of every sale
            </span>
            . Build once, earn forever.
          </p>
          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-6">
            <button
              onClick={() => navigate("/auth")}
              className="text-white font-display text-2xl sm:text-3xl px-8 sm:px-12 py-3 sm:py-4 transition-transform active:translate-x-1 active:translate-y-1 cursor-pointer"
              style={{
                background: SUNSET.magenta,
                boxShadow: `8px 8px 0px ${SUNSET.violet}`,
              }}
            >
              JOIN THE MOVEMENT
            </button>
            <button
              onClick={() => navigate("/shop")}
              className="border-2 text-white font-display text-2xl sm:text-3xl px-8 sm:px-12 py-3 sm:py-4 hover:bg-white/5 transition-colors cursor-pointer"
              style={{ borderColor: SUNSET.violet }}
            >
              BROWSE PRODUCTS
            </button>
          </div>
        </section>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-20 sm:mb-32">
          {[
            { v: "$47M+", l: "Paid to creators", c: SUNSET.orange },
            { v: "127K+", l: "Active creators", c: SUNSET.magenta },
            { v: "890K+", l: "Products & Courses", c: SUNSET.violet },
            { v: "24/7", l: "You're making $$$", c: SUNSET.amber },
          ].map((s) => (
            <div
              key={s.l}
              className="border p-4 sm:p-6 transition-colors hover:border-current"
              style={{
                borderColor: `${s.c}4D`,
                background: `${s.c}0D`,
                color: s.c,
              }}
            >
              <div className="font-display text-3xl sm:text-5xl">{s.v}</div>
              <div className="text-[10px] sm:text-xs uppercase tracking-widest text-gray-500">
                {s.l}
              </div>
            </div>
          ))}
        </div>

        <LazySection minHeight={600} className="mb-20 sm:mb-32">
        {/* BENTO FEATURES */}
        <h2 className="sr-only">What you can do on TokMarket</h2>
        <div className="grid grid-cols-12 gap-4 sm:gap-6 mb-20 sm:mb-32">
          <div className="col-span-12 md:col-span-8 p-6 sm:p-10 bg-[#151515] border-2 border-white/10 rounded-2xl sm:rounded-3xl relative overflow-hidden group hover:border-[#e84393] transition-colors">
            <div className="relative z-10">
              <h3 className="font-display text-4xl sm:text-6xl mb-3 sm:mb-4">SELL ANYTHING</h3>
              <p className="text-base sm:text-xl text-gray-400 max-w-md">
                Physical products, digital downloads, merch—AI writes your
                listings in 10 seconds.
              </p>
              <button
                onClick={() => navigate("/create")}
                className="mt-6 sm:mt-8 inline-flex items-center font-bold gap-2 cursor-pointer"
                style={{ color: SUNSET.magenta }}
              >
                INSTANT SETUP →
              </button>
            </div>
            <div
              aria-hidden="true"
              className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 opacity-10 group-hover:opacity-30 transition-opacity pointer-events-none"
              style={{
                background: `linear-gradient(to bottom right, ${SUNSET.magenta}, transparent)`,
              }}
            />
          </div>

          <div className="col-span-12 md:col-span-4 p-6 sm:p-10 bg-[#151515] border-2 border-white/10 rounded-2xl sm:rounded-3xl hover:border-[#6c5ce7] transition-colors">
            <h3 className="font-display text-3xl sm:text-5xl mb-3 sm:mb-4">COACH</h3>
            <p className="text-base sm:text-lg text-gray-400">
              Upload courses, go live, build a following. Turn your knowledge
              into recurring income.
            </p>
          </div>

          <div className="col-span-12 md:col-span-4 p-6 sm:p-10 bg-[#151515] border-2 border-white/10 rounded-2xl sm:rounded-3xl hover:border-[#f7931e] transition-colors">
            <h3 className="font-display text-3xl sm:text-5xl mb-3 sm:mb-4">OWN IT</h3>
            <p className="text-base sm:text-lg text-gray-400">
              No algorithm BS. Your fans = your income. Build once, earn
              forever.
            </p>
          </div>

          <div
            className="col-span-12 md:col-span-8 p-6 sm:p-10 rounded-2xl sm:rounded-3xl flex flex-col md:flex-row gap-4 md:items-center md:justify-between"
            style={{
              background: `linear-gradient(to right, ${SUNSET.magenta}, ${SUNSET.violet})`,
            }}
          >
            <div>
              <h3 className="font-display text-4xl sm:text-6xl text-white leading-none">
                LIVE ACTIVITY FEED
              </h3>
              <p className="text-white/80 font-bold uppercase tracking-tighter mt-2 text-sm sm:text-base">
                +247 creators joined today
              </p>
            </div>
            <div className="hidden lg:block space-y-2">
              <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-sm italic">
                Sarah M. sold a course for $197
              </div>
              <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-sm italic translate-x-4">
                Mike D. earned $89 from merch
              </div>
              <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-sm italic">
                Chris P. went live for $543
              </div>
            </div>
          </div>
        </div>

        {/* CHIPS */}
        <h2 className="sr-only">Creators who win on TokMarket</h2>
        <div className="flex flex-wrap justify-center gap-4 mb-40">
          {[
            { name: "Fitness Coaches", bg: "#ffffff", color: "#000", rot: "rotate-2", glow: true },
            { name: "Artists", bg: SUNSET.orange, color: "#fff", rot: "-rotate-3" },
            { name: "Musicians", bg: SUNSET.violet, color: "#fff", rot: "rotate-1" },
            { name: "Teachers", bg: SUNSET.amber, color: "#000", rot: "-rotate-2" },
            { name: "Food Creators", bg: SUNSET.magenta, color: "#fff", rot: "rotate-2" },
            { name: "Business Experts", bg: "#ffffff", color: "#000", rot: "-rotate-1" },
            { name: "Gamers", bg: SUNSET.magenta, color: "#fff", rot: "-rotate-2" },
            { name: "Lifestyle Influencers", bg: "transparent", color: "#fff", rot: "rotate-2", border: true },
          ].map((c) => (
            <span
              key={c.name}
              className={`px-6 py-2 font-display text-xl rounded-full ${c.rot} transition-transform hover:rotate-0`}
              style={{
                background: c.bg,
                color: c.color,
                border: c.border ? "2px solid rgba(255,255,255,0.2)" : undefined,
                boxShadow: c.glow ? "0 0 15px rgba(255,255,255,0.4)" : undefined,
              }}
            >
              {c.name}
            </span>
          ))}
        </div>

        {/* COMPARISON */}
        <section className="mb-40 border-t-4 border-b-4 border-white py-20">
          <h2 className="font-display text-7xl text-center mb-16 tracking-tight">
            WHY CREATORS ARE{" "}
            <span style={{ color: SUNSET.magenta }}>SWITCHING</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-display text-3xl">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="py-6 px-4">Feature</th>
                  <th className="py-6 px-4 italic" style={{ color: SUNSET.orange }}>
                    TokMarket
                  </th>
                  <th className="py-6 px-4 text-gray-600">Platform A</th>
                  <th className="py-6 px-4 text-gray-600">Platform B</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { f: "You Keep", us: "90%", a: "0%", b: "0%" },
                  { f: "Sell Anything", us: "YES", a: "NO", b: "NO" },
                  { f: "Sell Courses", us: "YES", a: "NO", b: "NO" },
                  { f: "Own Your Audience", us: "YES", a: "NO", b: "NO" },
                  { f: "AI Listing Creator", us: "YES", a: "NO", b: "NO" },
                  { f: "Algorithm BS", us: "NEVER", a: "ALWAYS", b: "ALWAYS" },
                ].map((r) => (
                  <tr key={r.f}>
                    <td className="py-8 px-4 font-body font-bold text-lg text-gray-400">
                      {r.f}
                    </td>
                    <td
                      className="py-8 px-4"
                      style={{ color: SUNSET.magenta }}
                    >
                      {r.us}
                    </td>
                    <td className="py-8 px-4 text-gray-600 font-body font-normal text-sm">
                      {r.a}
                    </td>
                    <td className="py-8 px-4 text-gray-600 font-body font-normal text-sm">
                      {r.b}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <h2 className="font-display text-6xl text-center mb-12">
          REAL CREATORS.{" "}
          <span style={{ color: SUNSET.magenta }}>REAL RESULTS.</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-32">
          {[
            {
              name: "ALEX RIVERA",
              role: "Fitness Coach",
              quote:
                "Made more in my first month here than 2 years on other platforms combined.",
              earn: "$12K/mo",
              bg: "#ffffff",
              fg: "#000",
              accent: SUNSET.violet,
              shadow: SUNSET.violet,
              rot: "-rotate-1",
            },
            {
              name: "EMMA CHEN",
              role: "Art Teacher",
              quote:
                "Finally a platform that values creators. My students love the course format!",
              earn: "$8.5K/mo",
              bg: SUNSET.orange,
              fg: "#fff",
              accent: "#fff",
              shadow: "#ffffff",
              rot: "rotate-2",
            },
            {
              name: "JORDAN LEE",
              role: "Business Coach",
              quote:
                "Went from 0 to $15K monthly in 90 days. The audience ownership changed everything.",
              earn: "$15K/mo",
              bg: "#000",
              fg: "#fff",
              accent: SUNSET.magenta,
              shadow: SUNSET.magenta,
              rot: "-rotate-1",
              border: SUNSET.magenta,
            },
          ].map((t) => (
            <div
              key={t.name}
              className={`p-8 ${t.rot} hover:rotate-0 transition-transform`}
              style={{
                background: t.bg,
                color: t.fg,
                boxShadow: `10px 10px 0px ${t.shadow}`,
                border: t.border ? `2px solid ${t.border}` : undefined,
              }}
            >
              <div className="font-display text-3xl mb-1">{t.name}</div>
              <div
                className="text-xs uppercase tracking-widest mb-4 opacity-70"
              >
                {t.role}
              </div>
              <p className="italic mb-4 font-medium">"{t.quote}"</p>
              <div
                className="font-display text-4xl"
                style={{ color: t.accent }}
              >
                {t.earn}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto mb-40">
          <h2 className="font-display text-6xl text-center mb-12">
            COMMON <span style={{ color: SUNSET.amber }}>QUESTIONS</span>
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "How do I get paid?",
                a: "Instant payouts to your bank account or digital wallet. You keep 90% of every sale.",
                c: SUNSET.magenta,
              },
              {
                q: "Is it really free?",
                a: "100% free to join and create. We only make money when you make money (10% platform fee).",
                c: SUNSET.violet,
              },
              {
                q: "How fast can I start selling?",
                a: "Upload a product photo, AI creates the listing in 10 seconds. You can be live in under 5 minutes.",
                c: SUNSET.orange,
              },
              {
                q: "Do I need followers to start?",
                a: "Nope! Our feed algorithm shows your content to interested buyers from day one.",
                c: SUNSET.amber,
              },
            ].map((f) => (
              <div
                key={f.q}
                className="p-6 border border-white/20 transition-colors"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = f.c)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)")
                }
              >
                <div
                  className="font-display text-2xl mb-2"
                  style={{ color: f.c }}
                >
                  {f.q}
                </div>
                <p className="text-gray-400">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section
          className="relative p-1 overflow-hidden rounded-[3rem]"
          style={{
            background: `linear-gradient(to bottom right, ${SUNSET.orange}, ${SUNSET.magenta}, ${SUNSET.violet})`,
          }}
        >
          <div className="bg-black rounded-[2.9rem] p-10 sm:p-16 text-center">
            <div className="font-display text-6xl sm:text-8xl leading-none mb-6 italic">
              YOUR CONTENT.
              <br />
              YOUR MONEY.
              <br />
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: `linear-gradient(to right, ${SUNSET.amber}, ${SUNSET.orange})`,
                }}
              >
                YOUR RULES.
              </span>
            </div>
            <p className="text-xl text-gray-400 mb-10 max-w-xl mx-auto">
              Every minute you wait is money left on the table. Join 127,000+
              creators already earning.
            </p>
            <button
              onClick={() => navigate("/auth")}
              className="bg-white text-black font-display text-4xl px-16 py-6 rounded-full hover:scale-105 transition-transform cursor-pointer"
            >
              START EARNING TODAY →
            </button>
            <div className="mt-10 flex flex-wrap justify-center gap-8 text-xs font-bold uppercase tracking-widest text-gray-500">
              <span>✓ Free forever</span>
              <span>✓ No card needed</span>
              <span>✓ Start in 24hrs</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
