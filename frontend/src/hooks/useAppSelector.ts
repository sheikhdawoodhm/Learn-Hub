import { useSelector } from "react-redux";
import type { RootState } from "../redux/store/store";

export const useAppSelector = useSelector.withTypes<RootState>();
