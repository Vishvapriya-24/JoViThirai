import styles from "../../style/Skeleton.module.css";

function MovieSkeleton() {
  return (
    <div className={styles.movieSkeletonContainer}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className={`${styles.movieSkeletonCard} ${styles.skeleton}`}></div>
      ))}
    </div>
  );
}

export default MovieSkeleton;
