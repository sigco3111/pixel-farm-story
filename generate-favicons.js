// SVG 파비콘을 다양한 크기의 PNG로 변환하는 스크립트
import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

const inputSvg = path.resolve('public/favicon.svg');
const outputDir = path.resolve('public/icons');

/**
 * 파비콘 이미지를 생성하는 함수
 * @param {string} inputPath - 입력 SVG 파일 경로
 * @param {string} outputPath - 출력 PNG 파일 경로
 * @param {number} size - 이미지 크기
 */
async function generateIcon(inputPath, outputPath, size) {
  try {
    await sharp(inputPath)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`✓ 생성됨: ${outputPath} (${size}x${size}px)`);
  } catch (error) {
    console.error(`✗ 오류: ${outputPath} 생성 중 문제 발생`, error);
  }
}

/**
 * 모든 필요한 파비콘 크기를 생성하는 메인 함수
 */
async function generateFavicons() {
  try {
    // 디렉토리가 없으면 생성
    await fs.mkdir(outputDir, { recursive: true });

    // 다양한 크기의 파비콘 생성
    const sizes = {
      'favicon-16x16.png': 16,
      'favicon-32x32.png': 32,
      'apple-touch-icon.png': 180,
      'android-chrome-192x192.png': 192,
      'android-chrome-512x512.png': 512
    };

    // 각 크기별로 이미지 생성
    for (const [filename, size] of Object.entries(sizes)) {
      const outputPath = path.join(outputDir, filename);
      await generateIcon(inputSvg, outputPath, size);
    }

    console.log('✓ 모든 파비콘 생성 완료!');
  } catch (error) {
    console.error('✗ 파비콘 생성 중 오류 발생:', error);
  }
}

// 스크립트 실행
generateFavicons(); 