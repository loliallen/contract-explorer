import Head from "next/head";

export const Seo = () => {
  const title = "Contract Explorer by @loliallen";
  const description = "Explore your contracts without verifying";
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="og:title" content={description} />
      <meta name="og:description" content={description} />
    </Head>
  );
};
