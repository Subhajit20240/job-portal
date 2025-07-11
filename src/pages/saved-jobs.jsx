// import { getSavedJobs } from "@/api/apiJobs";
// import JobCard from "@/components/job-card";
// import useFetch from "@/hooks/use-fetch";
// import { useUser } from "@clerk/clerk-react";
// import { useEffect } from "react";
// import { BarLoader } from "react-spinners";

// const SavedJobs = () => {
//   const { isLoaded } = useUser();

//   const {
//     loading: loadingSavedJobs,
//     data: savedJobs,
//     fn: fnSavedJobs,
//   } = useFetch(getSavedJobs);

//   useEffect(() => {
//     if (isLoaded) {
//       fnSavedJobs();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isLoaded]);

//   if (!isLoaded || loadingSavedJobs) {
//     return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
//   }

//   return (
//     <div>
//       <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
//         Saved Jobs
//       </h1>

//       {loadingSavedJobs === false && (
//         <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {savedJobs?.length ? (
//             savedJobs?.map((saved) => {
//               return (
//                 <JobCard
//                   key={saved.id}
//                   job={saved?.job}
//                   onJobAction={fnSavedJobs}
//                   savedInit={true}
//                 />
//               );
//             })
//           ) : (
//             <div>No Saved Jobs 👀</div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SavedJobs;

import { useEffect, useState } from "react";
import JobCard from "@/components/job-card";
import useFetch from "@/hooks/use-fetch";
import { getSavedJobs } from "@/api/apiJobs";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import savedJobsData from "@/data/saved-jobs.json";

const SavedJobs = () => {
  const { user, isLoaded } = useUser();
  const [jobs, setJobs] = useState([]);

  const { loading, data, fn } = useFetch(getSavedJobs);

  // Fallback to dummy data
  const displayJobs = data || savedJobsData.filter(saved => saved.user_id === user?.id);

  useEffect(() => {
    if (user?.id) {
      fn({ user_id: user.id });
    }
  }, [user]);

  useEffect(() => {
    if (data) {
      setJobs(data);
    } else {
      // Use dummy data filtered by user
      setJobs(savedJobsData.filter(saved => saved.user_id === user?.id));
    }
  }, [data, user]);

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Saved Jobs
      </h1>

      {loading && (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}

      {!loading && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayJobs?.length ? (
            displayJobs.map((saved) => {
              return (
                <JobCard
                  key={saved.id}
                  job={saved?.job}
                  onJobAction={() => {}}
                  savedInit={true}
                />
              );
            })
          ) : (
            <div>No Saved Jobs 👀</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
