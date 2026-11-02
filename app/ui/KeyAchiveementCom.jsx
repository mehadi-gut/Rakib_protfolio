import { GitBranch, Star, Trophy } from "lucide-react";

const achievements = [
  {
    icon: Star,
    title: "Built End-to-End Test Automation Framework",
    description:
      "Automated 38 end-to-end test scenarios across setup, WooCommerce order management, and Google Sheets synchronization using Playwright and TypeScript, achieving a 100% pass rate and eliminating manual regression testing.",
    number: "01",
  },
  {
    icon: Trophy,
    title: "Engineered a Zero-Touch CI/CD Pipeline",
    description:
      "Implemented a Dockerized GitHub Actions pipeline auto-triggered on every plugin commit via repository_dispatch, provisioning a fresh WordPress + WooCommerce environment and validating the exact pushed version before release.",
    number: "02",
  },
];

const KeyAchiveementCom = () => {
  return (
    <section
      aria-labelledby="achievements-title"
      className="relative overflow-hidden bg-[#080d18] px-5 py-20 text-white sm:px-8 sm:py-24 lg:px-[8vw]"
    >
      

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-9 flex items-center gap-4">
          <h2
            id="achievements-title"
            className="achievement-eyebrow shrink-0 text-sm font-semibold tracking-[0.12em] text-slate-300"
          >
            KEY ACHIEVEMENTS
          </h2>
          <span className="achievement-rule h-px flex-1 bg-gradient-to-r from-blue-400/70 to-white/10" />
        </div>

        <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
          {achievements.map(({ icon: Icon, title, description, number }) => (
            <article
              key={number}
              className="achievement-card group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-5 transition-colors duration-300 hover:border-blue-300/30 hover:bg-white/[0.055] sm:p-7"
            >
              <span className="absolute right-5 top-5 font-mono text-xs tracking-widest text-slate-600">
                {number}
              </span>
              <div className="flex items-start gap-4 sm:gap-5">
                <span className="achievement-icon grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-blue-300/15 bg-blue-400/10 text-blue-300 transition-colors duration-300 group-hover:border-blue-300/30 group-hover:bg-blue-400/15 sm:h-14 sm:w-14">
                  <Icon aria-hidden="true" size={22} strokeWidth={1.8} />
                </span>
                <div className="min-w-0 pr-5">
                  <h3 className="max-w-md text-lg font-semibold leading-snug tracking-tight text-white sm:text-xl">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-[0.95rem] sm:leading-7">
                    {description}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-2 pl-16 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-blue-300/70 sm:pl-[4.75rem]">
                <GitBranch aria-hidden="true" size={13} />
                Quality engineering
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyAchiveementCom;
