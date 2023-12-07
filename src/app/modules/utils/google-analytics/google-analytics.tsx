import ReactGA from "react-ga";
import ReactGA4 from "react-ga4";
import MasterConfix from '../../../../setup/MasterConfix';

const InitializeGoogleAnalytics = () => {
  // Initialize UA
  ReactGA.initialize("UA-XXXXXXXX-X");
  // Initialize GA4 - Add your measurement ID
  ReactGA4.initialize(MasterConfix.GA_MEASUREMENT_ID);

  console.log("GA INITIALIZED");
};

const TrackGoogleAnalyticsEvent = (
  category: string,
  action: string,
  label: string
) => {
  console.log("GA event:", category, ":", action, ":", label);
  // Send UA Event
  ReactGA.event({
    category: category,
    action: action,
    label: label,
  });
  // Send GA4 Event
  ReactGA4.event({
    category: category,
    action: action,
    label: label,
  });
};

export default InitializeGoogleAnalytics;
export { InitializeGoogleAnalytics, TrackGoogleAnalyticsEvent };