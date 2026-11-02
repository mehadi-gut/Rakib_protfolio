import HomeSceneExperience from "./HomeSceneExperience";
import ProjectsCom from "./ProjectsCom";
import RakibIntro from "./RakibIntro";
import SkillCom from "./SkillCom";
import ExparienceCom from "./ExparienceCom";
import ContactCom from "./ContactCom";
import KeyAchiveementCom from "./KeyAchiveementCom";
import Navbar from "./Navbar";

const PortfolioPage = () => {
  return (
    <main className="relative min-h-[100dvh] w-full bg-[#080d18] text-white">
      <HomeSceneExperience />
      <Navbar />
      <RakibIntro />
      <ProjectsCom />
      <SkillCom />
      <ExparienceCom />
      <KeyAchiveementCom />
      <ContactCom />
    </main>
  );
};

export default PortfolioPage;
