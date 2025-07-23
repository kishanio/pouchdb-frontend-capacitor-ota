import { Spinner } from "./Spinner";

function FullScreenSpinner() {
  return (
    <div className="fixed flex items-center justify-center w-full h-full">
      <Spinner />
    </div>
  );
}

export default FullScreenSpinner;