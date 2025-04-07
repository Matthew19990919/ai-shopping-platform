import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * 可动画化的元素组件
 * 用于为页面元素添加平滑的滚动出现、悬停和其他动画效果
 * 
 * @param {Object} props
 * @param {string} props.animation - 动画类型: 'fadeIn', 'fadeInUp', 'fadeInLeft', 'fadeInRight', 'scale', 'bounce'
 * @param {number} props.delay - 动画延迟 (秒)
 * @param {number} props.duration - 动画持续时间 (秒)
 * @param {boolean} props.triggerOnce - 是否只触发一次
 * @param {string} props.className - 额外的CSS类名
 * @param {Object} props.style - 额外的样式
 * @param {React.ReactNode} props.children - 子元素
 */
const AnimatedElement = ({
  animation = 'fadeIn',
  delay = 0,
  duration = 0.5,
  triggerOnce = true,
  className = '',
  style = {},
  children,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  // 根据动画类型返回合适的动画变体
  const getVariants = () => {
    const variants = {
      hidden: {},
      visible: {
        transition: {
          duration,
          delay,
          ease: 'easeOut',
        },
      },
    };

    // 根据不同的动画类型设置不同的初始状态和结束状态
    switch (animation) {
      case 'fadeIn':
        variants.hidden = { opacity: 0 };
        variants.visible.opacity = 1;
        break;

      case 'fadeInUp':
        variants.hidden = { opacity: 0, y: 30 };
        variants.visible.opacity = 1;
        variants.visible.y = 0;
        break;

      case 'fadeInDown':
        variants.hidden = { opacity: 0, y: -30 };
        variants.visible.opacity = 1;
        variants.visible.y = 0;
        break;

      case 'fadeInLeft':
        variants.hidden = { opacity: 0, x: -30 };
        variants.visible.opacity = 1;
        variants.visible.x = 0;
        break;

      case 'fadeInRight':
        variants.hidden = { opacity: 0, x: 30 };
        variants.visible.opacity = 1;
        variants.visible.x = 0;
        break;

      case 'scale':
        variants.hidden = { opacity: 0, scale: 0.8 };
        variants.visible.opacity = 1;
        variants.visible.scale = 1;
        break;

      case 'bounce':
        variants.hidden = { opacity: 0, y: 0 };
        variants.visible = {
          opacity: 1,
          y: [0, -15, 0, -7, 0],
          transition: {
            duration: 0.6,
            delay,
            times: [0, 0.3, 0.6, 0.8, 1],
          },
        };
        break;

      default:
        variants.hidden = { opacity: 0 };
        variants.visible.opacity = 1;
    }

    return variants;
  };

  // 处理元素可见性
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.disconnect();
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [triggerOnce]);

  // 获取动画变体
  const variants = getVariants();

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={variants}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedElement; 