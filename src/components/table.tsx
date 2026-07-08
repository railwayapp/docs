import React from "react";

export const Table: React.FC<React.ComponentProps<"table">> = props => {
  return (
    <div className="table-scroll">
      <table {...props} />
    </div>
  );
};
