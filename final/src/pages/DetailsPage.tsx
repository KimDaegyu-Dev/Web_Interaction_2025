import { useParams, useNavigate } from "react-router-dom";

export function DetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-white p-8 text-black dark:bg-gray-900 dark:text-white">
      <h1 className="mb-4 text-4xl font-bold">Building Details</h1>
      <p className="mb-8 text-xl">Building ID: {id}</p>
      <button
        onClick={() => navigate(-1)}
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
      >
        Go Back
      </button>
    </div>
  );
}
