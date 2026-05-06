import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
	import.meta.env.VITE_SUPABASE_URL as string,
	import.meta.env.VITE_SUPABASE_ANON_KEY as string,
	{
		realtime: {
			params: {
				eventsPerSecond: -1,
			},
		},
		db: {
			schema: "public",
		},
	},
);
