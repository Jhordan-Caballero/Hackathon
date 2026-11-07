
import MainLayout from '../components/layout/MainLayout';

import HeroSection from '../components/sections/HeroSection';
import TrustLogosSection from '../components/sections/TrustLogosSection';
import EditorialShowcase from '../components/sections/EditorialShowcase';
import FeaturesSection from '../components/sections/FeaturesSection';
import ModulesSection from '../components/sections/ModulesSection';
import ComparisonSection from '../components/sections/ComparisonSection';
import CallToActionSection from '../components/sections/CallToActionSection';

function Home() {
    return (
        <MainLayout>
            <main>
                <HeroSection />
                <TrustLogosSection />
                <EditorialShowcase />
                <FeaturesSection />
                <ModulesSection />
                <ComparisonSection />
                <CallToActionSection />
            </main>
        </MainLayout>
    );
}

export default Home;
