import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Converter from "@/components/Converter";

export default function Home() {
  return (
    <>
      <Navbar />

      <main
        className="grid-bg"
        style={{ minHeight: "100vh", position: "relative", paddingBottom: 40 }}
      >
        <div className="orb orb-1" />
        <div className="orb orb-2" />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1240,
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          <Hero />
          <Converter />
        </div>
      </main>

      <Footer />
    </>
  );
}
