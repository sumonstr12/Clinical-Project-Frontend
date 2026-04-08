import { useEffect, useState } from "react";
import myaxios from "../../assets/utilities/myaxios";

let cachedData = null; 

export default function useDashboardData() {
  const [data, setData] = useState(cachedData);

  useEffect(() => {
    if (cachedData) return; 

    const fetchData = async () => {
      try {
        const res = await myaxios.get("admin/user-count/");
        cachedData = res.data.data;
        setData(cachedData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return data;
}