import React from "react";

const Plan = () => {
  return (
    <form className="flex mx-auto w-100 min-h-96 flex-col gap-4">
      <label htmlFor="plan"></label>
      <textarea
        className="border-2 border-gray-300 rounded-md p-2 h-full w-full flex-1 "
        id="plan"
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default Plan;
