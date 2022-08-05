import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="w-full md:w-96 p-5 flex flex-col items-center justify-center bg-slate-800 rounded-tl-[3rem] rounded-tr-[3rem] text-slate-500 text-sm">
      <p className="mb-3">
        check this project in{' '}
        <a href="https://github.com/hnqg/me3" className="underline">
          Github
        </a>
      </p>
      <p>
        me3 is a creation of{' '}
        <Link href="/u/hnqg" passHref>
          <a className="text-pink-600 font-heading text-xs">@hnqg</a>
        </Link>
      </p>
    </footer>
  );
};
