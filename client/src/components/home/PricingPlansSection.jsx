import React from "react";

const Pricing = () => {
  return (
    <section className="container mx-auto">
      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="mx-auto mb-[60px] max-w-[510px] text-center">
              <span className="mb-2 block text-lg font-semibold text-purple-600">
                Pricing Plans
              </span>
              <h2 className="mb-3 text-3xl font-bold leading-[1.208] text-dark dark:text-white sm:text-4xl md:text-[40px]">
                Affordable Online Quran Classes for Everyone
              </h2>
              <p className="text-base text-body-color dark:text-dark-6">
                Choose the <strong>online Quran learning plan</strong> that suits your schedule and learning pace. All plans include a free trial lesson.
              </p>
            </div>
          </div>
        </div>

        <div className="-mx-4 flex flex-wrap justify-center">
          <div className="-mx-4 flex flex-wrap">
            <PricingCard
              type="Standard Plan"
              price="$64"
              subscription="month"
              description="2 hours/week – Ideal for consistent progress"
              buttonText="Choose Standard"
              link="https://wa.me/201227307646?text=Hello!%20I'm%20interested%20in%20the%20Standard%20Plan%20($64/month)%20with%202%20hours%20per%20week.%20I'd%20like%20to%20know%20more%20and%20try%20the%20Free%20Trial%20Lesson."
            >
              <List>Monthly Reports</List>
              <List>Rewards & Certificates</List>
              <List>Free Trial Lesson</List>
              <List>Native Arabic Tutor</List>
            </PricingCard>

            <PricingCard
              type="Regular Plan"
              price="$96"
              subscription="month"
              description="3 hours/week – Balanced and flexible learning"
              buttonText="Choose Regular"
              active={true}
              link="https://wa.me/201227307646?text=Hello!%20I'm%20interested%20in%20the%20Regular%20Plan%20($96/month)%20with%203%20hours%20per%20week.%20I'd%20like%20to%20know%20more%20and%20try%20the%20Free%20Trial%20Lesson."
            >
              <List>Monthly Reports</List>
              <List>Rewards & Certificates</List>
              <List>Free Trial Lesson</List>
              <List>Native Arabic Tutor</List>
            </PricingCard>

            <PricingCard
              type="Condensed Plan"
              price="$128"
              subscription="month"
              description="4 hours/week – Fast-track Quran learning"
              buttonText="Choose Condensed"
              link="https://wa.me/201227307646?text=Hello!%20I'm%20interested%20in%20the%20Condensed%20Plan%20($128/month)%20with%204%20hours%20per%20week.%20I'd%20like%20to%20know%20more%20and%20try%20the%20Free%20Trial%20Lesson."
            >
              <List>Monthly Reports</List>
              <List>Rewards & Certificates</List>
              <List>Free Trial Lesson</List>
              <List>Native Arabic Tutor</List>
            </PricingCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;

const PricingCard = ({
  children,
  description,
  price,
  type,
  subscription,
  buttonText,
  active,
  link
}) => {
  return (
      <div className="w-full px-4 md:w-1/2 lg:w-1/3">
        <div className="relative z-10 mb-10 overflow-hidden rounded-[10px] border-1 bg-white px-8 py-10 shadow-pricing dark:bg-zinc-900/50 dark:border sm:p-12 lg:px-6 lg:py-10 xl:p-[50px]">
          <span className="mb-3 block text-lg font-semibold text-purple-600">
            {type}
          </span>
          <h2 className="mb-5 text-[42px] font-bold text-dark dark:text-white">
            {price}
            <span className="text-base font-medium text-body-color dark:text-dark-6">
              / {subscription}
            </span>
          </h2>
          <p className="mb-8 border-b border-stroke pb-8 text-base text-body-color dark:border-dark-3 dark:text-dark-6">
            {description}
          </p>
          <div className="mb-9 flex flex-col gap-[14px]">{children}</div>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Choose ${type}`}
            className={` ${
              active
                ? "btn primary-purple-btn block w-full rounded-md border border-primary bg-primary p-3 text-center text-base font-medium text-white transition hover:bg-opacity-90"
                : "block w-full rounded-md border border-stroke bg-transparent p-3 text-center text-base text-zinc-900 bg-zinc-200 hover:text-zinc-200 hover:bg-zinc-900 font-medium text-primary transition dark:border-dark-3"
            } `}
          >
            {buttonText}
          </a>
          <div>
            <span className="absolute right-0 top-7 z-[-1]">
              <svg
                width={77}
                height={172}
                viewBox="0 0 77 172"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx={86} cy={86} r={86} fill="url(#paint0_linear)" />
                <defs>
                  <linearGradient
                    id="paint0_linear"
                    x1={86}
                    y1={0}
                    x2={86}
                    y2={172}
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#a855f7" stopOpacity="0.09" />
                    <stop offset={1} stopColor="#C4C4C4" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <span className="absolute right-4 top-4 z-[-1]">
              <svg
                width={41}
                height={89}
                viewBox="0 0 41 89"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g fill="#a855f7">
                  {[...Array(4)].map((_, row) =>
                    [...Array(4)].map((_, col) => (
                      <circle
                        key={`${row}-${col}`}
                        cx={38.9138 - 12.5 * col}
                        cy={87.4849 - 12.5 * row}
                        r={1.42}
                      />
                    ))
                  )}
                </g>
              </svg>
            </span>
          </div>
        </div>
      </div>
  );
};

const List = ({ children }) => {
  return (
    <p className="text-base text-body-color dark:text-dark-6 flex items-center gap-2">
      <span className="text-green-500">✓</span> {children}
    </p>
  );
};