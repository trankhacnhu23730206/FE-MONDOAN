import { Navigate, Outlet, useLocation } from "react-router-dom";

function PrivateRoute() {
  const location = useLocation();
  const token =
    localStorage.getItem("accessToken") || localStorage.getItem("token");

  return token ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
}

export default PrivateRoute;