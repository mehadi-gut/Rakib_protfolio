import { ArrowUpRight, Link2, Mail, MapPin, Phone } from "lucide-react";

const contacts = [
  {
    label: "Phone",
    value: "+880 1701 026708",
    href: "tel:+8801701026708",
    Icon: Phone,
  },
  {
    label: "Email",
    value: "rakibul.cse.bubt@gmail.com",
    href: "mailto:rakibul.cse.bubt@gmail.com",
    Icon: Mail,
  },
  {
    label: "LinkedIn",
    value: "Rakibul Islam",
    Icon: Link2,
  },
  {
    label: "GitHub",
    value: "Rakibul Islam",
    Icon: Link2,
  },
  {
    label: "Location",
    value: "Dhaka, Bangladesh",
    Icon: MapPin,
  },
];

const ContactCom = () => {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative isolate overflow-hidden bg-[#080d18] px-5 pb-8 pt-20 text-white sm:px-8 sm:pb-10 sm:pt-24 lg:px-[8vw]"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl sm:mb-14">
          <p className="contact-eyebrow mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-blue-300">
            <span className="h-px w-8 bg-blue-400" />
            Get in touch
          </p>
          <h2
            id="contact-title"
            className="contact-title text-4xl font-semibold tracking-[-0.06em] sm:text-6xl"
          >
            Let&apos;s connect<span className="text-blue-400">.</span>
          </h2>
          <p className="contact-description mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
            Have a project or opportunity in mind? I&apos;d be glad to hear from
            you.
          </p>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {contacts.map(({ label, value, href, Icon }) => {
            const content = (
              <>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.05] text-blue-300 transition-colors group-hover:border-blue-300/30 group-hover:bg-blue-400/10">
                  <Icon aria-hidden="true" size={18} strokeWidth={1.8} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-medium text-slate-400">
                    {label}
                  </span>
                  <span className="mt-1 block break-words text-sm font-medium text-slate-100 sm:text-[0.95rem]">
                    {value}
                  </span>
                </span>
                {href && (
                  <ArrowUpRight
                    aria-hidden="true"
                    size={16}
                    className="shrink-0 text-slate-500 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-300"
                  />
                )}
              </>
            );

            return (
              <li key={label} className="contact-item">
                {href ? (
                  <a
                    href={href}
                    className="group flex min-h-[5.25rem] items-center gap-3 rounded-2xl border border-white/[0.09] bg-white/[0.035] p-4 transition-colors duration-200 hover:border-blue-300/30 hover:bg-white/[0.055] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
                  >
                    {content}
                  </a>
                ) : (
                  <div className="group flex min-h-[5.25rem] items-center gap-3 rounded-2xl border hover:border-blue-300/30 hover:bg-white/[0.055] border-white/[0.09] bg-white/[0.035] p-4">
                    {content}
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <div className="contact-footer mt-12 flex flex-col gap-3 border-t border-white/10 pt-5 text-xs text-slate-500 sm:mt-16 sm:flex-row sm:items-center sm:justify-between">
          <p>Rakibul Islam · Quality Engineering</p>
          <p>Dhaka, Bangladesh</p>
        </div>
      </div>
    </section>
  );
};

export default ContactCom;
