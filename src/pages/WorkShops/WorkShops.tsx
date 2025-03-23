// Example Usage Component with Grid Layout for multiple cards
const WorkShops = () => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {isLoading
        ? // Show multiple skeletons while loading
          Array(6)
            .fill()
            .map((_, index) => <WorkshopCardSkeleton key={index} />)
        : // Show actual workshop cards
          workshops.map((workshop) => (
            <WorkshopCard key={workshop.id} workshop={workshop} />
          ))}
    </div>
  );
};

export default WorkShops;
