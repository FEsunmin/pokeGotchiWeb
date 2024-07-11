import React from 'react';
import FormCard from './_components/FormCard';
import UploadBtn from './_components/UploadBtn';

function page() {
  return (
    <div>
      <header className="mt-10">
        <h1 className="ml-10 text-lg font-semibold">게시물 업로드</h1>
      </header>
      <FormCard />
      <UploadBtn />
    </div>
  );
}

export default page;