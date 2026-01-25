import React from "react";
import Image, { StaticImageData } from "next/image";
import Container from "../Container";
import Title from "../Title";

interface SponsorTier {
  tier: string;
  sponsors: {
    image: StaticImageData;
    alt: string;
    width?: string;
    logoSize?: string;
  }[];
  gradient: string;
  borderColor: string;
  tierColor: string;
}

interface SponsorsProps {
  tiers: SponsorTier[];
}

const Sponsors: React.FC<SponsorsProps> = ({ tiers }) => {
  return (
    <Container className="flex flex-col items-center gap-6 md:gap-8">
      <Title
        title="Our Sponsors"
        subtitle=""
      />
      
      <div className="w-full flex flex-col gap-12 md:gap-16">
        {tiers.map((tier, index) => (
          <div key={index} className="flex flex-col gap-0">
            {/* Tier Label */}
            <div 
              className="text-[10px] md:text-[12px] font-bold tracking-[0.15em] uppercase pl-1 mb-1"
              style={{ color: tier.tierColor }}
            >
              {tier.tier}
            </div>

            {/* Sponsors Grid - Stay single column until lg (1024px) */}
            <div className={`grid ${
              tier.sponsors.length === 1 
                ? "grid-cols-1" 
                : tier.sponsors.length === 2 && tier.tier === "SILVER TIER"
                ? "grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4 lg:gap-6" 
                : "grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6"
            } w-full`}>
              {tier.sponsors.map((sponsor, sponsorIndex) => (
                <div
                  key={sponsorIndex}
                  className={`relative rounded-[15px] overflow-hidden group hover:scale-[1.01] transition-transform duration-300 ${sponsor.width || ''}`}
                  style={{
                    background: tier.gradient,
                  }}
                >
                  {/* Fixed heights at different breakpoints for better control */}
                  <div className="relative w-full flex items-center justify-center text-center px-6 sm:px-8 lg:px-12 py-2 h-[100px] sm:h-[120px] lg:h-[140px] xl:h-[155px]">
                    <Image
                      src={sponsor.image}
                      alt={sponsor.alt}
                      className={`object-contain w-auto max-w-[85%] mx-auto ${
                        sponsor.logoSize || 'max-h-[65%]'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default Sponsors;