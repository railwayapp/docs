import React, { ButtonHTMLAttributes } from "react";

export const Button: React.FC<
  ButtonHTMLAttributes<HTMLButtonElement>
> = props => <button className="btn-primary" {...props} />;
