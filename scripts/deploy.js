// scripts/deploy.js — One-command deploy to GitHub Pages via gh CLI

import { execSync } from 'child_process';

function run(command, silent = false) {
  return execSync(command, { encoding: 'utf-8', stdio: silent ? 'pipe' : 'inherit' });
}

function runCapture(command) {
  try {
    return execSync(command, { encoding: 'utf-8', stdio: 'pipe' }).trim();
  } catch (_) {
    return '';
  }
}

console.log('🚀 Przygotowywanie wdrożenia aplikacji na GitHub Pages...\n');

// 1. Check if git is initialized
const isGit = runCapture('git rev-parse --is-inside-work-tree') === 'true';
if (!isGit) {
  console.log('📦 Inicjalizacja repozytorium git...');
  run('git init -b main');
}

// 2. Commit all changes
run('git add -A');
const status = runCapture('git status --porcelain');
if (status) {
  console.log('📝 Zapisywanie zmian (commit)...');
  run('git commit -m "Aktualizacja PWA z pełnym wsparciem offline i GitHub Pages"');
}

// 3. Get GitHub username
let username = runCapture('gh api user -q .login');
if (!username) {
  console.error('❌ Brak autoryzacji w GitHub CLI. Zaloguj się wpisując: gh auth login');
  process.exit(1);
}

const repoName = 'prawo-jazdy-teoria';
console.log(`👤 Użytkownik GitHub: ${username}`);
console.log(`📁 Nazwa repozytorium: ${repoName}\n`);

// 4. Check if remote exists
const remotes = runCapture('git remote');
if (!remotes.includes('origin')) {
  console.log('🌐 Tworzenie zdalnego repozytorium na GitHubie...');
  try {
    run(`gh repo create ${repoName} --public --source=. --remote=origin --push`);
  } catch (err) {
    console.log('Próba połączenia z istniejącym repozytorium...');
    run(`git remote add origin https://github.com/${username}/${repoName}.git`);
    run('git push -u origin main');
  }
} else {
  console.log('📤 Wypychanie zmian na GitHub...');
  run('git push -u origin main');
}

// 5. Enable GitHub Pages using GitHub Actions
// (the first push runs the workflow before Pages exists, so enable it and re-run)
const pagesExists = runCapture(`gh api repos/${username}/${repoName}/pages -q .html_url`);
if (!pagesExists) {
  console.log('⚙️  Włączanie GitHub Pages (źródło: GitHub Actions)...');
  run(`gh api repos/${username}/${repoName}/pages -X POST -f build_type=workflow`, true);
  run(`gh workflow run deploy.yml --repo ${username}/${repoName} --ref main`, true);
}

const siteUrl = `https://${username}.github.io/${repoName}/`;

console.log('\n=============================================================');
console.log('🎉 SUKCES! Twoja aplikacja została wdrożona na GitHub Pages!');
console.log('=============================================================');
console.log(`🌐 Twój stały adres HTTPS: ${siteUrl}`);
console.log('=============================================================');
console.log('📱 KROKI NA TELEFONIE (iPhone / Android):');
console.log('1. Otwórz powyższy adres w Safari na telefonie.');
console.log('2. Kliknij ikonę Udostępnij ⎋ -> "Do ekranu początkowego".');
console.log('3. Gotowe! Cała aplikacja, pytania i testy działają teraz');
console.log('   z pamięci Twojego telefonu w 100% offline — możesz całkowicie');
console.log('   wyłączyć komputer i odłączyć się od sieci!');
console.log('=============================================================\n');
