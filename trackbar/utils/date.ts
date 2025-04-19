import { format, fromUnixTime } from "date-fns";

export const convertUnixTimestampToISO = (
  timestamp?: number
): string | undefined => {
  if (!timestamp) return undefined;

  try {
    const date = fromUnixTime(timestamp);

    return format(date, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
  } catch (error) {
    console.error("Error converting timestamp:", error);
    return undefined;
  }
};
