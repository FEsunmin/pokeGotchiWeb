'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/supabase/supabaseClient';
import { useAuth } from '@/contexts/auth.context/auth.context';
import Image from 'next/image';
import img from '@/assets/random profile1.png';
import Swal from 'sweetalert2';

const defaultProfileImage = img.src;
const MAX_CONTENT_LENGTH = 125;

const EditPost = () => {
  const router = useRouter();
  const { id } = useParams();
  const { me } = useAuth();
  const [content, setContent] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [newImage, setNewImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string>('');
  const [profileImgUrl, setProfileImgUrl] = useState<string | null>(null);
  const [contentLength, setContentLength] = useState(0);

  const toUrlSafeString = (filename: string) => {
    return filename.replace(/\s/g, '_').replace(/[^a-zA-Z0-9_\-\.]/g, '');
  };

  useEffect(() => {
    async function fetchPost() {
      if (!id) return;

      const { data: postData, error: postError } = await supabase
        .from('posts')
        .select('content, img_url, user_id')
        .eq('id', id)
        .single();

      if (postError) {
        console.error('게시물 fetch 에러:', postError);
      } else if (me) {
        setContent(postData.content);
        setImgUrl(postData.img_url);
        setPreviewImage(postData.img_url);
        setContentLength(postData.content.length);

        const { data, error } = await supabase.from('users').select('nickname, profile_image').eq('id', me.id).single();

        if (error) {
          console.error('사용자 정보 fetch 에러:', error);
        } else if (data) {
          setNickname(data.nickname || '');
          setProfileImgUrl(data.profile_image || defaultProfileImage);
        }
      }
    }

    fetchPost();
  }, [id, me]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
      setNewImage(e.target.files[0]);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_CONTENT_LENGTH) {
      setContent(value);
      setContentLength(value.length);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let imageUrl = imgUrl;

    if (newImage) {
      try {
        const imageName = `${Date.now()}-${toUrlSafeString(newImage.name)}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('sns')
          .upload(`posts/${imageName}`, newImage);

        if (uploadError) {
          console.error('이미지 업로드 에러:', uploadError);
          Swal.fire('에러', '이미지 업로드 중 오류가 발생했습니다.', 'error');
          return;
        }

        const { data: publicUrlData, error: publicUrlError } = (await supabase.storage
          .from('sns')
          .getPublicUrl(uploadData?.path || '')) as any;

        if (publicUrlError) {
          console.error('퍼블릭 URL 가져오기 에러:', publicUrlError);
          Swal.fire('에러', '이미지 URL 가져오기 중 오류가 발생했습니다.', 'error');
          return;
        }

        if (publicUrlData?.publicUrl) {
          imageUrl = publicUrlData.publicUrl;
        }
      } catch (error) {
        console.error('이미지 업로드 및 URL 가져오기 중 에러:', error);
        Swal.fire('에러', '이미지 업로드 및 URL 가져오기 중 오류가 발생했습니다.', 'error');
        return;
      }
    }

    const { error } = await supabase.from('posts').update({ content, img_url: imageUrl }).eq('id', id);

    if (error) {
      console.error('게시물 수정 에러:', error);
      Swal.fire('에러', '게시물 수정 중 오류가 발생했습니다.', 'error');
    } else {
      Swal.fire('성공', '게시물이 성공적으로 수정되었습니다.', 'success').then(() => {
        router.push('/sns');
      });
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="mt-5 text-2xl font-bold">게시물 수정</h1>
      <form onSubmit={handleSubmit} className="flex w-[100%] flex-col items-center">
        <div className="mt-5 flex w-[450px] items-center">
          <Image
            width={10}
            height={10}
            src={profileImgUrl || defaultProfileImage}
            alt="profileImg"
            className="h-[40px] w-[40px] rounded-full border"
          />
          <p className="ml-5">{nickname}</p>
        </div>
        <div className="mb-4 w-[450px]">
          <label className="mt-5 block text-sm font-bold" htmlFor="content">
            내용
          </label>
          <textarea
            id="content"
            className="mt-3 h-[180px] w-[100%] resize-none rounded-md border pl-[10px] pt-5"
            value={content}
            onChange={handleContentChange}
          />
          <div className="text-right text-sm text-gray-500">{`${contentLength}/${MAX_CONTENT_LENGTH}`}</div>
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold" htmlFor="image">
            이미지
          </label>
          <div className="mt-5 flex w-[420px] flex-col items-center">
            {previewImage && (
              <img
                src={previewImage}
                alt="Post Image"
                style={{ maxWidth: '100%', maxHeight: '300px' }}
                className="mb-3 rounded-lg"
              />
            )}
            <input type="file" id="image" onChange={handleImageChange} />
          </div>
        </div>
        <button
          type="submit"
          className="mt-5 w-[100px] rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        >
          수정
        </button>
      </form>
    </div>
  );
};

export default EditPost;
