update public.snippets
set language = 'tsx'
where language = 'jsx';

alter table public.snippets
drop constraint if exists snippets_language_check;

alter table public.snippets
add constraint snippets_language_check
check (language in ('javascript', 'typescript', 'tsx', 'python', 'css', 'html'));
