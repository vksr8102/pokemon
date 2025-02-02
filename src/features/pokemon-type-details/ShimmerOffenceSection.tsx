import { FC, ReactElement } from "react";

export const ShimmerOffenceSection: FC = (): ReactElement => {
  return (
    <div className="mb-6 rounded-md bg-white p-3.5 shadow-md dark:bg-dark-card md:p-5">
     <div
                     
                      className="h-6 w-16 bg-gray-100 dark:bg-dark-base rounded-md"
                    ></div>

      {Array.from({ length: 1 }).map((_, typeIndex) => (
        <div key={typeIndex}>
          <h3 className="pb-2.5 text-lg font-bold bg-gray-100 dark:bg-dark-card rounded-md animate-pulse h-6 w-1/4"></h3>
          <div className="grid grid-cols-4 max-sm:grid-cols-1 ">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="my-4 border max-sm:flex items-center animate-pulse bg-gray-100 dark:bg-dark-base rounded-md"
              >
                <div className="sm:border-b max-sm:border-r max-sm:h-full max-sm:flex max-sm:items-center">
                  <div className="h-6 w-12 bg-gray-100 dark:bg-dark-base my-2 rounded-md"></div>
                </div>
                <div className="inline-flex flex-wrap gap-2 px-4 py-4">
                  {Array.from({ length: 5 }).map((_, subIndex) => (
                    <div
                      key={subIndex}
                      className="h-6 w-16 bg-gray-100 dark:bg-dark-card rounded-full"
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
