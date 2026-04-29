import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title} | Gurukul Excellence</title>
      <meta name="description" content={description || "Premium Coaching Institute for JEE, NEET & Foundation"} />
      <meta name="keywords" content={keywords || "coaching, IIT JEE, NEET, foundation, education, online classes, Gurukul"} />
      <meta property="og:title" content={`${title} | Gurukul Excellence`} />
      <meta property="og:description" content={description || "Premium Coaching Institute for JEE, NEET & Foundation"} />
      <meta property="og:type" content="website" />
    </Helmet>
  );
};

export default SEO;
