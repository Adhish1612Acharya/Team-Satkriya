import React, { FC } from "react";

import {
  Cog as Cow,
  Heart,
  Users,
  Map,
  ShoppingBag,
  VideoIcon,
  Activity,
  Phone,
  MessageCircle,
  Info,
} from "lucide-react";
import HomeProps from "./Home.types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FeatureCard from "@/components/FeatureCard/FeatureCard";

const BreedCard: FC<HomeProps> = ({ name, image, description, traits }) => {
  return (
    <Card className="overflow-hidden transition-transform hover:scale-105">
      <img src={image} alt={name} className="w-full h-48 object-cover" />
      <CardContent className="p-6">
        <h3 className="text-2xl font-bold text-primary mb-2">{name}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        <div className="space-y-2">
          {traits.map((trait, index) => (
            <div key={index} className="flex items-center text-sm">
              <Info className="h-4 w-4 text-primary mr-2" />
              <span className="text-muted-foreground">{trait}</span>
            </div>
          ))}
        </div>
        <Button className="mt-4 w-full">Learn More</Button>
      </CardContent>
    </Card>
  );
};

function Home() {
  const impactMetrics = [
    { label: "Cows Saved", value: "12,450+" },
    { label: "Farmers Supported", value: "5,200+" },
    { label: "Successful Treatments", value: "28,900+" },
    { label: "Organic Farms", value: "850+" },
    { label: "CO₂ Reduced (tons)", value: "15,000+" },
  ];

  const breeds = [
    {
      name: "Gir",
      image:
        "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?ixlib=rb-4.0.3",
      description: "Known for high milk yield and disease resistance",
      traits: ["A2 Milk", "Heat Tolerant", "Disease Resistant"],
    },
    {
      name: "Sahiwal",
      image:
        "https://images.unsplash.com/photo-1545468800-85cc9bc6ecf7?ixlib=rb-4.0.3",
      description: "Excellent dairy breed with good mothering ability",
      traits: ["High Fat Content", "Adaptable", "Good Mother"],
    },
    {
      name: "Red Sindhi",
      image:
        "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQ7QVzl5Goiu3fUqO6vh7Xs1H59QlBphyYIRN_J2ovWaaYKb8LPLm5menceV-gl_3gioDKE3bFiy8teUlqtGk6vHg",
      description: "Hardy breed suitable for tropical climate",
      traits: ["Heat Resistant", "Low Maintenance", "Regular Breeder"],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cow className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Indian Cow Revival</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            {["Home", "About", "Services", "Contact"].map((item) => (
              <Button key={item} variant="ghost">
                {item}
              </Button>
            ))}
            <Button>Connect Now</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1598715559054-0dd66c7e811c?auto=format&fit=crop&q=80')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/50" />
        <div className="container mx-auto px-4 relative z-10 text-white text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Preserving India's Heritage
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Join us in our mission to protect and revive indigenous cow breeds
            through sustainable practices and modern technology
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <Users className="mr-2 h-5 w-5" /> Connect with Experts
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 backdrop-blur-sm"
            >
              <Heart className="mr-2 h-5 w-5" /> Adopt a Cow
            </Button>
          </div>
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {impactMetrics.map((metric, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <p className="text-3xl font-bold text-primary mb-2">
                    {metric.value}
                  </p>
                  <p className="text-muted-foreground">{metric.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Users className="h-8 w-8" />}
              title="Expert Consultation"
              description="Connect with veterinary experts through live chat and video calls"
            />
            <FeatureCard
              icon={<Map className="h-8 w-8" />}
              title="Breed Mapping"
              description="Interactive map showing indigenous cow breed distribution"
            />
            <FeatureCard
              icon={<Heart className="h-8 w-8" />}
              title="Cow Adoption"
              description="Support farmers by virtually adopting indigenous cows"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <FeatureCard
              icon={<ShoppingBag className="h-8 w-8" />}
              title="Marketplace"
              description="Buy and sell organic cow products from verified sellers"
            />
            <FeatureCard
              icon={<VideoIcon className="h-8 w-8" />}
              title="Educational Content"
              description="Access training videos and resources on sustainable farming"
            />
            <FeatureCard
              icon={<Activity className="h-8 w-8" />}
              title="Health Tracking"
              description="Monitor cow health and get timely medical alerts"
            />
          </div>
        </div>
      </section>

      {/* Indigenous Breeds Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Indigenous Breeds</h2>
            <p className="text-xl text-muted-foreground">
              Discover India's precious cow breeds
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {breeds.map((breed, index) => (
              <BreedCard key={index} {...breed} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our community of farmers, experts, and supporters in preserving
            India's indigenous cow breeds
          </p>
          <Button size="lg" variant="secondary">
            Get Started Now
          </Button>
        </div>
      </section>
    </div>
  );
}

export default Home;
