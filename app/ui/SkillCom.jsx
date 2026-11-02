const skillGroups = [
  {
    number: "01",
    title: "Test automation",
    description: "Reliable coverage, from browser flows to intelligent test creation.",
    skills: [
      "Playwright",
      "End-to-End (E2E) Testing",
      "Cross-browser testing",
      "Regression Testing",
      "AI-Assisted Test Automation",
    ],
  },
  {
    number: "02",
    title: "Quality engineering",
    description: "A thoughtful approach to quality across APIs and user interfaces.",
    skills: [
      "Quality Engineering",
      "API & Web UI Testing",
      "JavaScript",
      "TypeScript",
      "SQL",
    ],
  },
  {
    number: "03",
    title: "Tools & delivery",
    description: "Practical tooling that keeps collaboration and delivery moving.",
    skills: ["Docker", "Git", "GitHub Actions", "CI/CD", "Postman", "Agile"],
  },
];

const SkillCom = () => {
  return (
    <section
      aria-labelledby="skills-title"
      className="relative isolate overflow-hidden bg-[#080d18]  px-5 py-24 text-white sm:px-8 sm:py-28 lg:px-[8vw]"
    >
     

      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl sm:mb-16">
          <p className="skills-eyebrow mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-blue-300">
            <span className="h-px w-8 bg-blue-400" />
            My toolkit
          </p>
          <h2
            id="skills-title"
            className="skills-title text-4xl font-semibold tracking-[-0.06em] text-white sm:text-6xl"
          >
            Skills<span className="text-blue-400"> &</span> tools
          </h2>
          <p className="skills-intro mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
            The tools and practices I use to build confidence in every release.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {skillGroups.map((group) => (
            <article
              key={group.number}
              className="skill-group group relative overflow-hidden rounded-3xl border border-white/[0.09] bg-white/[0.025] p-5 backdrop-blur-sm transition-colors duration-300 hover:border-blue-300/30 hover:bg-white/[0.055] sm:p-7"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-7 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
              <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                  <p className="mb-2 text-[0.68rem] font-semibold tracking-[0.18em] text-blue-300/70">
                    {group.number} / TOOLSET
                  </p>
                  <h3 className="text-xl font-medium tracking-tight text-white sm:text-2xl">
                    {group.title}
                  </h3>
                </div>
                <span
                  aria-hidden="true"
                  className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-400 shadow-[0_0_18px_rgba(96,165,250,0.8)] transition-transform duration-300 group-hover:scale-125"
                />
              </div>

              <p className="mb-7 min-h-12 text-sm leading-6 text-slate-400">
                {group.description}
              </p>

              <ul className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <li
                    key={skill}
                    className="skill-chip rounded-full border border-white/10 bg-white/[0.045] px-3 py-2 text-xs font-medium text-slate-300 transition-[color,border-color,transform] duration-200 hover:scale-[1.035] hover:-translate-y-0.5 hover:border-blue-300/35 hover:text-white sm:text-[0.8rem]"
                  >
                    {skill}
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

export default SkillCom;
