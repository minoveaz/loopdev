grant select, insert, update, delete
on table public.marketing_campaign_records
to authenticated;

grant select, insert, update, delete
on table public.marketing_links,
	public.marketing_campaign_publications,
	public.marketing_link_clicks
to authenticated;