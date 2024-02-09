import { Seo } from 'src/components/seo';
// import { usePageView } from 'src/hooks/use-page-view';
// import { Layout as MarketingLayout } from 'src/layouts/marketing';

const Page = () => {
  // usePageView();

  return (
    <>
      <Seo />
      <main>
        <h1>Hello World</h1>
      </main>
    </>
  );
};
// Page.getLayout = (page) => <MarketingLayout>{page}</MarketingLayout>;
export default Page;
