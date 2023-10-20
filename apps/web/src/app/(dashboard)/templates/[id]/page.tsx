import React from 'react';

import { redirect } from 'next/navigation';

import { getRequiredServerComponentSession } from '@documenso/lib/next-auth/get-server-session';
import { getFieldsForTemplate } from '@documenso/lib/server-only/field/get-fields-for-template';
import { getRecipientsForTemplate } from '@documenso/lib/server-only/recipient/get-recipients-for-template';
import { getTemplateById } from '@documenso/lib/server-only/template/get-template-by-id';
import { getFile } from '@documenso/lib/universal/upload/get-file';

import { TemplateType } from '~/components/formatter/template-type';

import { EditTemplateForm } from './edit-template';

export type TemplatePageProps = {
  params: {
    id: string;
  };
};

export default async function TemplatePage({ params }: TemplatePageProps) {
  const { id } = params;

  const templateId = Number(id);

  if (!templateId || Number.isNaN(templateId)) {
    redirect('/documents');
  }

  const { user } = await getRequiredServerComponentSession();

  const template = await getTemplateById({
    id: templateId,
    userId: user.id,
  }).catch(() => null);

  if (!template || !template.templateDocumentData) {
    redirect('/documents');
  }

  const { templateDocumentData } = template;

  const templateDataUrl = await getFile(templateDocumentData)
    .then((buffer) => Buffer.from(buffer).toString('base64'))
    .then((data) => `data:application/pdf;base64,${data}`);

  const [templateRecipients, templateFields] = await Promise.all([
    await getRecipientsForTemplate({
      templateId,
      userId: user.id,
    }),
    await getFieldsForTemplate({
      templateId,
      userId: user.id,
    }),
  ]);

  return (
    <div className="mx-auto max-w-screen-xl px-4 md:px-8">
      <div> Template</div>

      <h1 className="mt-4 truncate text-2xl font-semibold md:text-3xl" title={template.title}>
        {template.title}
      </h1>

      <div className="mt-2.5 flex items-center gap-x-6">
        <TemplateType inheritColor type={template.type} className="text-muted-foreground" />
      </div>

      <EditTemplateForm
        className="mt-8"
        template={template}
        user={user}
        recipients={templateRecipients}
        fields={templateFields}
        dataUrl={templateDataUrl}
      />
    </div>
  );
}