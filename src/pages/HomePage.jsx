import Background from "../styles/Background";
import TopBar from "../components/TopBar";
import Hero from "../components/Hero";
import GameGrid from "../components/GameGrid";
import Marquee from "../components/Marquee";
import Footer from "../components/Footer";
import { useTheme } from "../context/ThemeContext";

export default function HomePage() {
  const { colors } = useTheme();

  return (
    <div 
      className="min-h-screen overflow-x-hidden relative flex flex-col"
      style={{ background: colors.bg, color: colors.text }}
    >
      <Background />
      <TopBar />
      <Hero />
      <GameGrid />
      <Marquee />
      <Footer />
    </div>
  );
}
