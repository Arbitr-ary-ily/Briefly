import { currentUser } from '@clerk/nextjs/server';
import NewsAggregatorClient from './NewsAggregatorClient';

const NewsAggregator = async () => {
  const user = await currentUser();
  const onboardingCompleted = user?.unsafeMetadata?.onboardingCompleted || false;

  return <NewsAggregatorClient initialOnboardingCompleted={onboardingCompleted} />;
};

export default NewsAggregator;