import { ABOUT_TEXT } from "i18n/about";
import { useRouter } from "next/router";

const About = () => {
  const { locale } = useRouter();

  return (
    <div>
      <h1>{ABOUT_TEXT.get("hero", locale)}</h1>
    </div>
  );
};

export default About;
