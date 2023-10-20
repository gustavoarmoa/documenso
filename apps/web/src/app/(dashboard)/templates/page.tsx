import React from 'react';

import { getRequiredServerComponentSession } from '@documenso/lib/next-auth/get-server-session';
import { getTemplates } from '@documenso/lib/server-only/template/get-templates';

import { TemplatesDataTable } from './data-table-templates';

type AdminManageUsersProps = {
  searchParams?: {
    page?: number;
    perPage?: number;
  };
};

export default async function TemplatesPage({ searchParams = {} }: AdminManageUsersProps) {
  const { user } = await getRequiredServerComponentSession();
  const page = Number(searchParams.page) || 1;
  const perPage = Number(searchParams.perPage) || 10;

  const { templates, totalPages } = await getTemplates({
    userId: user.id,
    page: page,
    perPage: perPage,
  });

  return (
    <div className="mx-auto max-w-screen-xl px-4 md:px-8">
      <h1 className="mb-5 mt-2 truncate text-2xl font-semibold md:text-3xl">Templates</h1>

      <div className="relative">
        <TemplatesDataTable
          templates={templates}
          page={page}
          perPage={perPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}