-- Enable deletion of own profile
create policy "Users can delete own profile"
  on profiles for delete
  to authenticated
  using ( auth.uid() = id );
