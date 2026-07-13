import logo from "@/assets/logo.png";

const BackgroundLogo = () => {
  return (
    <div className="bg-logo-watermark">
      <img src={logo} alt="" aria-hidden="true" />
    </div>
  );
};

export default BackgroundLogo;
