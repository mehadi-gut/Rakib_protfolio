const experiences = [
  {
    role: "Jr. SQA Engineer",
    company: "WPPOOL",
    date: "Oct 2024 — Present",
    location: "Remote",
    current: true,
    highlights: [
      "Designed and executed end-to-end manual and automated test suites for WordPress plugins, including FlexOrder, FlexStock, EchoRewards, FlexTable, FormyChat, WP Dark Mode, and Jitsi Meet.",
      "Built reusable Playwright (TypeScript) automation frameworks using the Page Object Model for end-to-end, functional, and regression testing.",
      "Automated WooCommerce and Google Sheets synchronization by integrating the Google Sheets API with the WooCommerce REST API.",
      "Performed API testing for endpoints, authentication, data integrity, and error handling across plugin integrations.",
      "Integrated automated test workflows into GitHub Actions CI/CD pipelines for continuous, commit-triggered testing.",
      "Executed release-candidate regression testing and provided reproducible bug reports.",
      "Verified cross-browser compatibility, UI responsiveness, and internationalization across supported WordPress plugins.",
      "Created user guides and testing documentation; collaborated with cross-functional Agile teams to improve usability and product quality.",
      "Identified high-impact scenarios and expanded automation coverage across WordPress plugins.",
    ],
  },
  {
    role: "SQA Engineer",
    company: "Zaimah Technologies Ltd.",
    date: "Dec 2023 — Apr 2024",
    location: "Dhaka, Bangladesh",
    highlights: [
      "Started with manual testing, identifying defects and inconsistencies through a methodical test approach.",
      "Performed end-to-end testing of MacroHealthPlus to verify functionality across modules.",
      "Used Apache JMeter to evaluate website performance and stability under varied load conditions.",
      "Conducted comprehensive API testing with Postman, verifying endpoints, request parameters, and responses.",
    ],
  },
  {
    role: "Software QA Engineer — Intern",
    company: "Edutechs",
    date: "Jan 2022 — Dec 2022",
    location: "Dhaka, Bangladesh",
    highlights: [
      "Collaborated with developers and designers in an Agile, squad-based environment to support usability, security, and quality.",
      "Reviewed design and technical specifications to create detailed test plans and comprehensive test cases.",
      "Generated automation scripts, executed test scenarios, and compiled reports to support product quality assurance.",
    ],
  },
];

const ExperienceCom = () => {
  return (
    <section
    id="experience"
      aria-labelledby="experience-title"
      className="relative overflow-hidden bg-[#080d18] px-5 py-24 text-slate-900 sm:px-8 sm:py-28 lg:px-[8vw]"
    >
      {/* <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-52 top-10 h-[30rem] w-[30rem] rounded-full bg-blue-200/30 blur-[100px]"
      /> */}

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-14 max-w-2xl sm:mb-20">
          <p className="experience-eyebrow mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
            <span className="h-px w-8 bg-blue-600" />
            Career journey
          </p>
          <h2
            id="experience-title"
            className="experience-heading text-white text-4xl font-semibold tracking-[-0.06em] sm:text-6xl"
          >
            Experience<span className="text-blue-700">.</span>
          </h2>
          <p className="experience-summary mt-5 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
            Building dependable products through thoughtful testing,
            automation, and collaboration.
          </p>
        </div>

        <div className="experience-list relative space-y-5 pl-5 sm:space-y-7 sm:pl-10">
          <span
            aria-hidden="true"
            className="experience-line absolute bottom-7 left-[5px] top-7 w-px bg-gradient-to-b from-blue-600 via-blue-300 to-slate-200 sm:left-[9px]"
          />

          {experiences.map((experience, index) => (
            <article
              key={experience.company}
              className="experience-card group relative rounded-3xl border border-white/10 bg-white/[0.025] p-5 shadow-[0_12px_40px_rgba(15,23,42,0.045)] transition-all duration-300 hover:-translate-y-1 text-slate-300 hover:border-blue-300/30 hover:bg-white/[0.055]  sm:p-7 lg:p-9"
            >
              <span
                aria-hidden="true"
                className="absolute -left-[25px] top-7 grid h-3 w-3 place-items-center rounded-full border-[3px] border-[#f7f8fa] bg-blue-600 shadow-[0_0_0_1px_rgba(37,99,235,0.25)] sm:-left-[37px] sm:top-9 sm:h-4 sm:w-4"
              />

              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-2">
                    <span className="text-xs font-semibold tracking-[0.12em] text-blue-700">
                      0{index + 1}
                    </span>
                    {experience.current && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-emerald-700">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                        Current role
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                    {experience.role}
                  </h3>
                  <p className="mt-1 text-base font-medium text-blue-700">
                    {experience.company}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2 text-xs font-medium text-slate-600 sm:text-sm">
                  <span className="rounded-full border border-slate-200 bg-slate-300 px-3 py-1.5">
                    {experience.date}
                  </span>
                  <span className="rounded-full border border-slate-200 bg-slate-300 px-3 py-1.5">
                    {experience.location}
                  </span>
                </div>
              </div>

              <ul className="mt-6 space-y-2.5 border-t border-slate-600 pt-5 sm:mt-7 sm:space-y-3 sm:pt-6">
                {experience.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="experience-point flex gap-3 text-sm leading-6 text-slate-400 sm:text-[0.95rem]"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[0.62rem] h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500"
                    />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceCom;
