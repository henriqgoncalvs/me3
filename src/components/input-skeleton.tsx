import Skeleton from 'react-loading-skeleton';

export const InputSkeleton = () => (
  <>
    <Skeleton
      className="mb-1"
      width="130px"
      height="16px"
      style={{
        float: 'left',
        marginBottom: '8px',
      }}
    />
    <Skeleton width="100%" style={{ marginBottom: '12px' }} />
  </>
);
