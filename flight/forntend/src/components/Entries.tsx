import { useQuery } from "@tanstack/react-query";
import diaryService from "../services/diary";

const Entries = () => {
  const { data } = useQuery({
    queryKey: ["entries"],
    queryFn: diaryService.getAll,
  });

  if (!data) return null;
  console.log(data);
  return (
    <>
      <h2>Diary entries</h2>
      {data.map((entry) => (
        <div key={entry.id}>
          <h3>{entry.date}</h3>
          <p>Visibility: {entry.visibility}</p>
          <p>Weather: {entry.weather}</p>
        </div>
      ))}
    </>
  );
};

export default Entries;
