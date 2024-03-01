import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { Layout as MarketingLayout } from 'src/layouts/marketing';
import { HomeFaqs } from 'src/sections/home/home-faqs';
import { HomeHero } from 'src/sections/home/home-hero';
import { HomeEvents } from 'src/sections/home/home-events';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import sendHttpRequest from 'src/utils/send-http-request';

const Page = () => {
  usePageView();

  const [eventData, setEvents] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (router.isReady === false) {
      return;
    }

    fetch(`http://localhost:8000/events/list/`)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          return response.json();
        } else if (response.status === 401 || response.status === 403) {
          router.push('/401');
        } else if (response.status === 404) {
          router.push('/404');
        } else {
          router.push('/500');
        }
      })
      .then((data) => {
        setEvents(data);
      });
  }, [router]);

  const visibleEvents = eventData
    ? eventData.filter((event) => event.visibility === 'Public').slice(0, 10)
    : [];

  return (
    <>
      <Seo />
      <main>
        <HomeHero />
        <HomeEvents events={visibleEvents} />
        <HomeFaqs />
      </main>
    </>
  );
};

Page.getLayout = (page) => <MarketingLayout>{page}</MarketingLayout>;

export default Page;
