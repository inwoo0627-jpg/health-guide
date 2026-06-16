document.addEventListener('DOMContentLoaded', () => {
    // UI 상태 관리
    const state = {
        days: null,
        level: null,
        optionIndex: 0,
        weakness: ""
    };

    // DOM 요소 캐싱
    const dayButtons = document.querySelectorAll('.day-btn');
    const physiqueCards = document.querySelectorAll('.physique-card');
    const advancedOptionsSection = document.getElementById('step-advanced-options');
    const routineOptionsContainer = document.getElementById('routine-options-container');
    const weaknessGroup = document.getElementById('weakness-group');
    const weaknessInput = document.getElementById('weakness-input');
    const generateBtn = document.getElementById('btn-generate');
    const resultSection = document.getElementById('routine-result');
    const resultSummary = document.getElementById('result-summary');
    const routineCardsContainer = document.getElementById('routine-cards-container');
    const setsGuideBox = document.getElementById('sets-guide-box');

    // 운동 상세 모달 관련 요소
    const modalDetail = document.getElementById('modal-exercise-detail');
    const btnCloseDetailModal = document.getElementById('btn-close-detail-modal');
    const detailName = document.getElementById('detail-exercise-name');
    const detailGif = document.getElementById('detail-exercise-gif');
    const detailBodyPart = document.getElementById('detail-bodypart');
    const detailTarget = document.getElementById('detail-target');
    const detailEquipment = document.getElementById('detail-equipment');
    const detailInstructions = document.getElementById('detail-instructions');
    const gifLoader = document.getElementById('gif-loader');

    // 1. 핵심 한글 운동 데이터베이스 (헬린이 고정 운동 및 헬소년/헬른 추천 풀)
    // 각 운동의 'searchName'을 통해 백그라운드 깃허브 데이터베이스 로드 시 실제 GIF 링크를 자동 매핑합니다.
    // LFS 파일들의 binary data 서빙을 위해 raw.githubusercontent.com 대신 github.com/.../raw/main/... 경로를 활용합니다.
        const exerciseDatabase = {
        '플라이 머신': {
            name: '플라이 머신 (Pec Deck Fly)',
            exerciseId: 'v3xmPAR',
            bodyPart: '가슴 (Chest)',
            target: '대흉근 (Pectorals)',
            equipment: '머신 (Machine)',
            instructions: [
                '머신 안쪽에 엉덩이와 등을 등받이에 완벽히 밀착해 앉습니다.',
                '패드를 양손으로 감싸 쥐고 팔꿈치를 살짝 굽혀 고정합니다.',
                '가슴 근육(겨드랑이 안쪽)에 힘을 주며 원을 그리듯 패드를 안쪽으로 모아줍니다.',
                '가슴 근육의 팽팽한 저항을 느끼며 천천히 시작 자세로 돌려보냅니다.'
            ]
        },
        '로우 인클라인 덤벨 프레스': {
            name: '로우 인클라인 덤벨 프레스 (Low Incline Dumbbell Press)',
            exerciseId: 'ns0SIbU',
            bodyPart: '가슴 (Chest - 상부)',
            target: '쇄골부 대흉근 (Upper Chest)',
            equipment: '덤벨 (Dumbbell)',
            instructions: [
                '인클라인 벤치 각도를 약 15~30도(낮은 각도)로 조절한 뒤 눕습니다.',
                '덤벨을 쇄골 아랫부분 수직선상에 두고 팔꿈치를 가슴 옆에 둡니다.',
                '가슴 상부의 수축을 느끼며 덤벨을 천장 방향으로 수직으로 밀어 올립니다.',
                '덤벨이 흔들리지 않게 주의하며 천천히 저항을 느끼며 가슴 옆으로 내립니다.'
            ]
        },
        '렛풀다운(뉴트럴 그립)': {
            name: '렛풀다운 - 뉴트럴 그립 (Neutral Grip Lat Pulldown)',
            exerciseId: '4c9BhzB',
            bodyPart: '등 (Back)',
            target: '광배근 (Lats)',
            equipment: '케이블 머신 (Cable)',
            instructions: [
                '패러렐 바(손바닥이 서로 마주 보는 바)를 케이블에 연결하고 쥡니다.',
                '허벅지를 패드에 단단히 고정하고 앉아 상체를 살짝만 뒤로 기울입니다.',
                '팔꿈치를 옆구리 방향으로 강하게 꽂아 내리면서 가슴 윗부분 쪽으로 바를 당깁니다.',
                '광배근이 쭉 늘어나는 저항을 느끼며 천천히 팔을 위로 펴줍니다.'
            ]
        },
        '롱풀(와이드 그립 일자 바)': {
            name: '롱풀 - 와이드 그립 일자 바 (Wide Grip Seated Row)',
            exerciseId: 'qcY50ZD',
            bodyPart: '등 (Back)',
            target: '등 상부/능형근 (Upper Back)',
            equipment: '케이블 머신 (Cable)',
            instructions: [
                '일자 바를 와이드 오버그립(어깨너비보다 넓게)으로 잡고 발을 지지대에 댑니다.',
                '허리를 꼿꼿이 세우고 무릎을 살짝 굽혀 시작 자세를 취합니다.',
                '바를 명치 밑이나 배꼽 윗부분 방향으로 당기면서 어깨 날개뼈를 등 뒤로 꽉 접어줍니다.',
                '등 상부 근육이 이완되는 것을 느끼며 천천히 팔을 앞으로 보냅니다.'
            ]
        },
        '어시스트 풀업': {
            name: '어시스트 풀업 (Assisted Pull-up)',
            exerciseId: 'kiJ4Z2K',
            bodyPart: '등 (Back)',
            target: '광배근 (Lats)',
            equipment: '머신 (Machine)',
            instructions: [
                '어시스트 풀업 머신의 무릎 패드에 무릎을 대고 바를 넓게 잡습니다.',
                '가슴을 위로 밀어올린 상태를 유지하며 광배근의 힘으로 몸을 올려줍니다.',
                '바 위로 턱이 올 때까지 당긴 뒤',
                '천천히 광배근의 저항을 느끼며 내려옵니다.'
            ]
        },
        '덤벨 숄더 프레스': {
            name: '덤벨 숄더 프레스 (Dumbbell Shoulder Press)',
            exerciseId: 'znQUdHY',
            bodyPart: '어깨 (Shoulders)',
            target: '전면/측면 삼각근 (Deltoids)',
            equipment: '덤벨 (Dumbbell)',
            instructions: [
                '벤치 각도를 세우고 엉덩이와 등을 받침대에 잘 고정하여 밀착해 앉습니다.',
                '덤벨을 귀 옆 높이에 위치시키고 손바닥은 정면을 보게 합니다.',
                '어깨 근육의 힘으로 덤벨을 머리 위 방향으로 수직으로 밀어 올립니다.',
                '어깨 긴장이 풀리지 않도록 주의하며 천천히 귀 옆까지 귀환시킵니다.'
            ]
        },
        '덤벨 사이드 레터럴 레이즈': {
            name: '덤벨 사이드 레터럴 레이즈 (Dumbbell Lateral Raise)',
            exerciseId: 'DsgkuIt',
            bodyPart: '어깨 (Shoulders)',
            target: '측면 삼각근 (Lateral Deltoid)',
            equipment: '덤벨 (Dumbbell)',
            instructions: [
                '덤벨을 양손에 쥐고 가슴을 편 채 똑바로 섭니다.',
                '팔꿈치를 살짝 굽히고 어깨 관절 힘으로 덤벨을 양옆으로 멀리 던지듯 들어 올립니다.',
                '덤벨 높이가 어깨선과 수평이 될 때까지만 올렸다가',
                '천천히 자극을 느끼며 내립니다.'
            ]
        },
        '덤벨 컬': {
            name: '덤벨 컬 (Dumbbell Bicep Curl)',
            exerciseId: 'NbVPDMW',
            bodyPart: '팔 - 이두 (Arms/Biceps)',
            target: '상완이두근 (Biceps)',
            equipment: '덤벨 (Dumbbell)',
            instructions: [
                '어깨너비로 서서 덤벨을 양손에 마주 보게 들고 팔꿈치를 옆구리에 붙입니다.',
                '덤벨을 위로 감아올리며 손바닥이 몸 쪽을 보게 자연스럽게 회전하며 들어 올립니다.',
                '이두근의 강한 수축 후 천천히 무게를 느끼며 아래로 내려줍니다.'
            ]
        },
        '케이블 트라이셉스 푸시 다운': {
            name: '케이블 트라이셉스 푸시 다운 (Cable Tricep Pushdown)',
            exerciseId: 'gAwDzB3',
            bodyPart: '팔 - 삼두 (Arms/Triceps)',
            target: '상완삼두근 (Triceps)',
            equipment: '케이블 머신 (Cable)',
            instructions: [
                '케이블 머신 로프 또는 일자 바를 쥐고 무릎을 살짝 굽혀 상체를 약간 숙입니다.',
                '팔꿈치를 갈비뼈 양옆에 완전히 밀착시켜 고정합니다.',
                '팔꿈치를 축으로 삼두근 힘만 사용하여 바닥을 향해 힘차게 팔을 펴서 내려 누릅니다.',
                '삼두근이 팽팽하게 버티는 저항을 느끼며 팔꿈치 각도를 다시 직각으로 구부려 돌아옵니다.'
            ]
        },
        '이너 타이': {
            name: '이너 타이 - 내전근 머신 (Inner Thigh / Hip Adduction)',
            exerciseId: 'oHsrypV',
            bodyPart: '하체 (Thighs)',
            target: '내전근 (Adductors)',
            equipment: '머신 (Machine)',
            instructions: [
                '머신에 엉덩이를 깊숙이 밀착해 바르게 앉습니다.',
                '패드가 허벅지 안쪽에 밀착되도록 가동 범위를 세팅합니다.',
                '고관절 안쪽(허벅지 안쪽 근육) 힘으로 패드를 중앙으로 꽉 모아줍니다.',
                '다리 안쪽 근육이 늘어나는 자극을 느끼며 힘을 빼지 않고 천천히 다리를 벌려 줍니다.'
            ]
        },
        '레그 익스텐션': {
            name: '레그 익스텐션 (Leg Extension)',
            exerciseId: 'my33uHU',
            bodyPart: '하체 - 대퇴사두 (Thighs/Quads)',
            target: '대퇴사두근 (Quadriceps)',
            equipment: '머신 (Machine)',
            instructions: [
                '의자 등받이에 엉덩이를 바짝 대고 앉아',
                '발목 윗부분이 하단 롤러 패드에 닿게 조절합니다.',
                '손잡이를 단단히 잡아 엉덩이가 뜨지 않게 제어하고',
                '무릎을 앞으로 곧게 펴서 들어 올립니다.',
                '허벅지 앞쪽 근육을 강하게 쥐어짠 후',
                '천천히 무릎을 직각으로 내리며 이완합니다.'
            ]
        },
        '시티드 레그 컬': {
            name: '시티드 레그 컬 (Seated Leg Curl)',
            exerciseId: 'Zg3XY7P',
            bodyPart: '하체 - 대퇴이두 (Thighs/Hamstrings)',
            target: '대퇴이두근/햄스트링 (Hamstrings)',
            equipment: '머신 (Machine)',
            instructions: [
                '시트에 바르게 앉아 발목 밑 아킬레스건이 패드에 오도록 맞추고 허벅지 홀더를 내립니다.',
                '손잡이를 꽉 잡은 채로 무릎을 아래쪽으로 강하게 굽혀 발뒤꿈치를 엉덩이 밑까지 당깁니다.',
                '허벅지 뒤쪽 햄스트링의 자극을 유지하면서 천천히 무릎을 곧게 폅니다.'
            ]
        },
        '레그프레스': {
            name: '레그프레스 (Leg Press)',
            exerciseId: '7zdxRTl',
            bodyPart: '하체 (Thighs)',
            target: '대퇴사두근/둔근 (Quads/Glutes)',
            equipment: '머신 (Machine)',
            instructions: [
                '레그프레스 머신 시트에 엉덩이와 허리를 잘 밀착해 눕습니다.',
                '발판 위에 발을 얹고 어깨너비로 벌려 뒤꿈치를 단단히 대줍니다.',
                '안전장치를 풀고 무릎이 가슴 방향으로 깊이 접혀 내려올 때까지 제어하며 내립니다.',
                '발바닥 전체',
                '특히 뒤꿈치 힘으로 밀어 올립니다 (무릎을 완전히 쭉 펴서 관절을 잠그지 않게 주의합니다).'
            ]
        },
        '루마니안 데드리프트': {
            name: '루마니안 데드리프트 (Romanian Deadlift)',
            exerciseId: 'wQ2c4XD',
            bodyPart: '하체/등 (Back/Thighs)',
            target: '햄스트링/둔근/기립근 (Hamstrings/Glutes/Spine)',
            equipment: '바벨 (Barbell)',
            instructions: [
                '바벨을 들고 곧게 서서 가슴을 열고 코어를 단단히 수축합니다.',
                '무릎을 거의 굽히지 않고 엉덩이를 뒤로 내밀며 바벨이 허벅지를 타고 무릎 아래까지 내려가도록 유도합니다.',
                '허벅지 뒤쪽과 엉덩이가 팽팽하게 조여지면',
                '다시 고관절을 앞으로 밀며 똑바로 일어섭니다.'
            ]
        },
        '핵스쿼트 머신': {
            name: '핵스쿼트 머신 (Hack Squat Machine)',
            exerciseId: 'Qa55kX1',
            bodyPart: '하체 - 대퇴사두 (Thighs/Quads)',
            target: '대퇴사두근 (Quadriceps)',
            equipment: '머신 (Machine)',
            instructions: [
                '핵스쿼트 등받이에 등을 밀착하고 어깨를 패드에 견고하게 고정합니다.',
                '발판에 발을 어깨너비로 올려 안전 레버를 해제합니다.',
                '허리와 시트가 떨어지지 않게 엉덩이를 제어하며 무릎이 평행이 될 때까지 내려앉습니다.',
                '발판 전체를 강하게 밀어내며 대퇴사두근 힘으로 일어섭니다.'
            ]
        },
        '벤치프레스': {
            name: '바벨 벤치프레스 (Barbell Bench Press)',
            exerciseId: 'EIeI8Vf',
            bodyPart: '가슴 (Chest)',
            target: '대흉근 (Pectorals)',
            equipment: '바벨 (Barbell)',
            instructions: [
                '플랫 벤치에 누워 바벨이 눈높이에 오도록 자세를 잡습니다.',
                '발바닥으로 지면을 강하게 짚고',
                '견갑골(날개뼈)을 뒤로 모아 고정합니다.',
                '바벨을 천천히 통제하면서 명치 윗부분을 향해 수직으로 내립니다.',
                '겨드랑이 쪽에 강한 긴장을 주며 바벨을 곧게 밀어 올립니다.'
            ]
        },
        '인클라인 덤벨프레스': {
            name: '인클라인 덤벨프레스 (Incline Dumbbell Press)',
            exerciseId: 'ns0SIbU',
            bodyPart: '가슴 (Chest - 상부)',
            target: '상부 대흉근 (Upper Chest)',
            equipment: '덤벨 (Dumbbell)',
            instructions: [
                '벤치 각도를 20도~45도 사이 본인이 자극을 가장 잘 느끼는 각도로 설정하고 덤벨을 들고 눕습니다.',
                '덤벨을 쇄골 아랫방향 가슴 윗부분 라인과 일치하게 배치합니다.',
                '수직 궤적으로 상부 가슴의 수축감을 짜내며 덤벨을 모아 밀어 올립니다.',
                '팔꿈치가 너무 뒤로 빠지지 않게 주의하며 천천히 내려 늘려줍니다.'
            ]
        },
        '체스트 프레스 머신': {
            name: '체스트 프레스 머신 (Chest Press Machine)',
            exerciseId: 'T0yTjgW',
            bodyPart: '가슴 (Chest)',
            target: '대흉근 (Pectorals)',
            equipment: '머신 (Machine)',
            instructions: [
                '체스트 프레스 머신 의자 높이를 조절하여 손잡이가 가슴 중앙에 오도록 앉습니다.',
                '발을 바닥에 붙이고 등을 등받이에 견고하게 밀착합니다.',
                '가슴 힘으로 손잡이를 앞으로 힘차게 밀어냅니다.',
                '천천히 저항을 느끼며 원위치로 돌아옵니다.'
            ]
        },
        '덤벨 플라이': {
            name: '덤벨 플라이 (Dumbbell Fly)',
            exerciseId: 'yz9nUhF',
            bodyPart: '가슴 (Chest)',
            target: '대흉근 (Pectorals)',
            equipment: '덤벨 (Dumbbell)',
            instructions: [
                '벤치에 누워 덤벨을 가슴 위로 마주 보게 듭니다.',
                '팔꿈치를 살짝 굽혀 고정한 채',
                '큰 원을 그리며 양옆으로 벌려 줍니다.',
                '가슴 근육의 이완을 느낀 뒤',
                '가슴을 모아주는 느낌으로 덤벨을 위로 다시 올립니다.'
            ]
        },
        '케이블 크로스오버': {
            name: '케이블 크로스오버 (Cable Crossover)',
            exerciseId: '0CXGHya',
            bodyPart: '가슴 (Chest)',
            target: '대흉근 (Pectorals)',
            equipment: '케이블 머신 (Cable)',
            instructions: [
                '도르래를 어깨높이보다 약간 높게 설정하고 손잡이를 잡고 한 걸음 앞으로 나옵니다.',
                '상체를 살짝 숙이고 팔꿈치를 살짝 굽혀 고정합니다.',
                '가슴 근육을 수축하며 큰 나무를 껴안듯 손을 몸 앞쪽 밑으로 모아줍니다.',
                '천천히 자극을 느끼며 케이블의 저항에 버티면서 양팔을 벌려 줍니다.'
            ]
        },
        '딥스': {
            name: '딥스 (Dips)',
            exerciseId: '9WTm7dq',
            bodyPart: '가슴/삼두 (Chest/Triceps)',
            target: '하부 대흉근 (Lower Chest)',
            equipment: '맨몸/머신 (Body weight)',
            instructions: [
                '평행봉 손잡이를 잡고 몸을 띄워 어깨가 들리지 않게 고정합니다.',
                '상체를 약 15~30도 앞쪽으로 숙여 아랫가슴에 체중이 실리게 합니다.',
                '팔꿈치를 직각이 될 때까지 구부리며 몸을 아래로 내립니다.',
                '가슴 하부 힘으로 바를 강하게 누르며 처음 높이로 밀어 올라옵니다.'
            ]
        },
        '티바로우': {
            name: '티바로우 (T-Bar Row)',
            exerciseId: 'BgljGjd',
            bodyPart: '등 (Back)',
            target: '광배근/능형근 (Middle Back)',
            equipment: '머신 (Machine)',
            instructions: [
                '티바로우 머신의 발판 위에 서서 힙 힌지를 잡아 척추 각도를 평평하게 만듭니다.',
                '손잡이를 잡고 가슴을 연 뒤',
                '복부에 힘을 주어 몸을 고정합니다.',
                '팔꿈치를 뒤로 당겨 손잡이가 배꼽이나 명치 방향으로 오게 바짝 당깁니다.',
                '등 근육의 날개뼈를 등 뒤로 꽉 접어주며 수축한 후 천천히 돌려보냅니다.'
            ]
        },
        '암풀다운': {
            name: '암풀다운 (Straight Arm Pulldown)',
            exerciseId: 'x69MAlq',
            bodyPart: '등 (Back)',
            target: '광배근 하부 (Lats)',
            equipment: '케이블 머신 (Cable)',
            instructions: [
                '케이블 머신 앞에 서서 바 또는 로프를 어깨너비로 오버그립으로 잡습니다.',
                '상체를 살짝 숙여 등을 편 상태에서 팔을 거의 곧게 고정합니다.',
                '바를 허벅지 방향으로 반원을 그리며 힘차게 눌러 내립니다.',
                '광배근의 강력한 수축을 느끼고',
                '다시 천천히 광배근을 늘리며 바를 올려줍니다.'
            ]
        },
        '바벨로우': {
            name: '바벨로우 (Barbell Row)',
            exerciseId: 'eZyBC3j',
            bodyPart: '등 (Back)',
            target: '광배근/승모근 (Spine/Lats)',
            equipment: '바벨 (Barbell)',
            instructions: [
                '바벨을 들고 무릎을 굽히며 상체를 약 45도 숙여 힙 힌지 자세를 취합니다.',
                '바벨이 허벅지를 스치듯 수직 궤적으로 배꼽 방향을 향해 힘차게 당깁니다.',
                '날개뼈를 접으며 상등과 광배근을 최대로 쥐어짠 후',
                '천천히 버티며 바벨을 늘립니다.'
            ]
        },
        '원암덤벨로우': {
            name: '원암 덤벨 로우 (One Arm Dumbbell Row)',
            exerciseId: 'C0MA9bC',
            bodyPart: '등 (Back)',
            target: '광배근 (Lats)',
            equipment: '덤벨 (Dumbbell)',
            instructions: [
                '한쪽 무릎과 한쪽 손을 벤치 위에 지지하고 척추를 일직선으로 폅니다.',
                '반대편 손에 덤벨을 들고 팔을 수직 아래로 내려 준비합니다.',
                '덤벨을 쥔 손의 팔꿈치를 골반 쪽으로 끌어당긴다는 느낌으로 옆구리를 스치며 수축합니다.',
                '광배근이 곧게 늘어나는 것을 통제하며 덤벨을 처음 자세로 내립니다.'
            ]
        },
        '데드리프트': {
            name: '바벨 데드리프트 (Barbell Deadlift)',
            exerciseId: 'ila4NZS',
            bodyPart: '등/전신 (Back/Full Body)',
            target: '기립근/둔근/등 상부 (Spine/Glutes/Back)',
            equipment: '바벨 (Barbell)',
            instructions: [
                '정강이가 바벨에 가깝게 대고 서서 발을 골반 너비로 벌립니다.',
                '힙 힌지를 잡고 내려가 바벨을 어깨너비로 잡습니다.',
                '가슴을 열고 척추를 평평하게 편 상태에서 발바닥으로 지면을 밀며 수직으로 일어섭니다.',
                '바가 몸을 타고 쓸어내리듯 엉덩이를 뒤로 빼며 준비 자세로 복귀합니다.'
            ]
        },
        '덤벨 리어 델트 플라이': {
            name: '덤벨 리어 델트 플라이 (Dumbbell Rear Delt Fly)',
            exerciseId: '8DiFDVA',
            bodyPart: '어깨 (Shoulders)',
            target: '후면 삼각근 (Posterior Deltoid)',
            equipment: '덤벨 (Dumbbell)',
            instructions: [
                '양손에 덤벨을 쥐고 상체를 숙여 바닥과 거의 수평이 되게 힙 힌지를 잡습니다.',
                '팔꿈치를 살짝만 구부린 채 고정하고 양옆으로 팔을 멀리 뻗어 들어 올립니다.',
                '후면 어깨 삼각근에 강한 수축을 준 후',
                '천천히 내려놓습니다 (등 날개뼈가 너무 접히지 않도록 통제합니다).'
            ]
        },
        '스미스 머신 숄더 프레스': {
            name: '스미스 머신 숄더 프레스 (Smith Machine Shoulder Press)',
            exerciseId: '903mzG8',
            bodyPart: '어깨 (Shoulders)',
            target: '전면 삼각근 (Anterior Deltoid)',
            equipment: '머신 (Smith Machine)',
            instructions: [
                '스미스 머신 아래에 각도 벤치를 수직에 가깝게 조절하여 앉습니다.',
                '바가 턱이나 인중 스쳐 내려오도록 팔꿈치 궤적을 확인하며 바를 잡습니다.',
                '바를 턱 라인까지 천천히 내렸다가',
                '전면 어깨의 강한 힘으로 수직 밀어 올립니다.'
            ]
        },
        '숄더 프레스 머신': {
            name: '숄더 프레스 머신 (Shoulder Press Machine)',
            exerciseId: '67n3r98',
            bodyPart: '어깨 (Shoulders)',
            target: '전면/측면 삼각근 (Deltoids)',
            equipment: '머신 (Machine)',
            instructions: [
                '의자 높이를 손잡이가 귀 옆에 오도록 세팅한 후 엉덩이를 시트에 밀착해 앉습니다.',
                '손잡이를 쥐고 전면 어깨의 수축을 활용해 끝까지 위로 밀어줍니다.',
                '관절에 힘을 풀지 않고 어깨에 긴장을 준 채 천천히 저항하며 복귀합니다.'
            ]
        },
        '리버스 펙덱플라이': {
            name: '리버스 펙덱플라이 (Reverse Pec Deck Fly)',
            exerciseId: 'myfUsKf',
            bodyPart: '어깨 (Shoulders)',
            target: '후면 삼각근 (Posterior Deltoid)',
            equipment: '머신 (Machine)',
            instructions: [
                '머신을 정면으로 마주 보고 가슴을 패드에 밀착시킨 뒤 앉습니다.',
                '손잡이를 잡고 어깨높이를 평평하게 세팅한 후 날개뼈를 고정합니다.',
                '오직 후면 어깨 근육만의 수축 힘으로 팔을 뒤로 부채꼴 모양으로 펼쳐 쥐어짜 줍니다.',
                '등이 너무 수축되지 않게 주의하며 천천히 원래대로 모아줍니다.'
            ]
        },
        '케이블 업라이트 로우': {
            name: '케이블 업라이트 로우 (Cable Upright Row)',
            exerciseId: 'cALKspW',
            bodyPart: '어깨 (Shoulders)',
            target: '측면 삼각근/승모근 (Lateral Deltoid/Traps)',
            equipment: '케이블 머신 (Cable)',
            instructions: [
                '케이블 하단에 일자 바를 꽂고 바를 골반 너비 수준으로 좁게 잡고 섭니다.',
                '바를 몸 쪽으로 가깝게 붙여 당기면서 팔꿈치를 양옆 위쪽으로 들어 올려줍니다.',
                '손목이 아니라 팔꿈치가 어깨높이만큼 치고 올라갈 수 있게 한 뒤',
                '천천히 내려놓습니다.'
            ]
        },
        '덤벨 프론트 레이즈': {
            name: '덤벨 프론트 레이즈 (Dumbbell Front Raise)',
            exerciseId: '3eGE2JC',
            bodyPart: '어깨 (Shoulders)',
            target: '전면 삼각근 (Anterior Deltoid)',
            equipment: '덤벨 (Dumbbell)',
            instructions: [
                '덤벨을 양손에 들고 똑바로 섭니다.',
                '팔꿈치를 아주 살짝 굽혀 고정한 채',
                '덤벨을 몸 앞으로 눈높이까지 들어 올립니다.',
                '전면 어깨의 자극을 느끼며 천천히 저항하며 내립니다.'
            ]
        },
        '바벨 컬': {
            name: '바벨 컬 (Barbell Bicep Curl)',
            exerciseId: '25GPyDY',
            bodyPart: '팔 - 이두 (Arms/Biceps)',
            target: '상완이두근 (Biceps)',
            equipment: '바벨 (Barbell)',
            instructions: [
                '바벨을 어깨너비로 오버그립이 아닌 언더그립으로 넓게 쥡니다.',
                '팔꿈치를 옆구리에 고정하고 바벨을 가슴 높이 부근까지 큰 호를 그리며 들어 올립니다.',
                '이두근의 강한 수축을 이끌어낸 뒤 천천히 내립니다.'
            ]
        },
        '이두 컬 머신': {
            name: '이두 컬 머신 (Bicep Curl Machine)',
            exerciseId: 'q6y3OhV',
            bodyPart: '팔 - 이두 (Arms/Biceps)',
            target: '상완이두근 (Biceps)',
            equipment: '머신 (Machine)',
            instructions: [
                '머신의 팔 패드에 삼두근 and 팔꿈치를 완전 밀착해 올립니다.',
                '의자 높이를 잘 맞춘 후 손잡이를 쥐고 얼굴 방향으로 당겨 올립니다.',
                '수축 시 팔꿈치가 들리지 않게 신경 쓰며 천천히 이완하여 줍니다.'
            ]
        },
        '케이블 컬': {
            name: '케이블 컬 - 어깨 뒤 신장 상태 (Behind the Back Cable Curl)',
            exerciseId: 'G08RZcQ',
            bodyPart: '팔 - 이두 (Arms/Biceps)',
            target: '상완이두근 장두 (Biceps Long Head)',
            equipment: '케이블 머신 (Cable)',
            instructions: [
                '케이블 머신 도르래를 최하단에 세팅하고 한 걸음 앞으로 나와 손잡이를 잡습니다.',
                '팔을 뒤쪽으로 자연스럽게 떨어뜨려 어깨보다 뒤에 오도록 이두를 최대로 길게 신장시킵니다.',
                '팔꿈치 위치를 유지한 채로 이두 장두의 팽팽한 장력을 느끼며 힘차게 컬 동작을 합니다.'
            ]
        },
        '라잉 트라이셉스 익스텐션': {
            name: '라잉 트라이셉스 익스텐션 (Lying Triceps Extension)',
            exerciseId: 'iZop9xO',
            bodyPart: '팔 - 삼두 (Arms/Triceps)',
            target: '상완삼두근 장두 (Triceps)',
            equipment: '바벨/이지바 (Barbell/EZ-bar)',
            instructions: [
                '벤치에 누워 이지바 또는 덤벨을 수직 위로 들고 팔꿈치를 고정합니다.',
                '팔꿈치를 머리 뒤 방향으로 약 15도 넘겨 삼두에 선장력을 줍니다.',
                '팔꿈치 위치가 고정된 상태에서 천천히 팔을 굽혀 이마나 정수리 뒤쪽으로 바를 내립니다.',
                '삼두근 전체의 힘을 모아 팔을 위쪽 대각선으로 힘껏 펴 줍니다.'
            ]
        },
        '케이블 트라이셉스 익스텐션': {
            name: '케이블 트라이셉스 익스텐션 (Cable Triceps Extension)',
            exerciseId: '2IxROQ1',
            bodyPart: '팔 - 삼두 (Arms/Triceps)',
            target: '상완삼두근 (Triceps)',
            equipment: '케이블 머신 (Cable)',
            instructions: [
                '케이블 머신 높이에 로프를 달고 상체를 앞으로 기울여 로프를 머리 위쪽에서 쥡니다.',
                '팔꿈치를 머리 옆에 완벽히 흔들리지 않게 고정합니다.',
                '정수리 앞 대각선 방향으로 팔을 일직선으로 쭉 펼치며 삼두를 깊숙이 수축합니다.',
                '천천히 긴장을 통제하면서 뒤로 팔을 접어 삼두를 이완합니다.'
            ]
        },
        '클로즈 그립 벤치프레스': {
            name: '클로즈 그립 벤치프레스 (Close Grip Bench Press)',
            exerciseId: 'J6Dx1Mu',
            bodyPart: '팔 - 삼두/가슴 (Arms/Triceps)',
            target: '상완삼두근/내측 흉근 (Triceps/Chest)',
            equipment: '바벨 (Barbell)',
            instructions: [
                '플랫 벤치에 누워 바벨을 어깨너비보다 좁은 한 뼘 정도의 좁은 간격으로 쥡니다.',
                '발을 바닥에 붙여 코어를 고정하고',
                '바벨을 수직으로 떼어내 줍니다.',
                '팔꿈치가 옆구리를 부드럽게 스치도록 가슴 하부 쪽으로 천천히 내립니다.',
                '삼두근 힘을 짜내며 다시 수직 위로 밀어 올립니다.'
            ]
        },
        '스쿼트': {
            name: '바벨 스쿼트 (Barbell Squat)',
            exerciseId: 'qXTaZnJ',
            bodyPart: '하체 (Thighs)',
            target: '대퇴사두근/둔근 (Quads/Glutes)',
            equipment: '바벨 (Barbell)',
            instructions: [
                '바벨을 승모근 위에 얹고 발을 골반 너비보다 약간 더 벌린 상태로 섭니다.',
                '가슴을 활짝 열고 기립근을 단단히 세운 채 엉덩이와 무릎을 동시에 구부립니다.',
                '허벅지가 바닥과 평행선에 닿을 만큼 깊이 주저앉았다가',
                '발뒤꿈치 힘으로 밀고 올라옵니다.'
            ]
        },
        '불가리안 스플릿 스쿼트': {
            name: '불가리안 스플릿 스쿼트 (Bulgarian Split Squat)',
            exerciseId: 'qx4fgX7',
            bodyPart: '하체 (Thighs)',
            target: '둔근/대퇴사두근 (Glutes/Quads)',
            equipment: '덤벨 (Dumbbell)',
            instructions: [
                '한쪽 다리 끝을 등 뒤 벤치 위에 거치하고 다른 쪽 다리는 앞으로 한 걸음 크게 딛습니다.',
                '상체 척추를 일직선으로 단단히 잡은 채',
                '앞다리의 고관절 and 무릎을 직각으로 구부립니다.',
                '뒷다리 관절이 아닌 앞발의 뒤꿈치를 지면으로 강하게 내리누르는 힘으로 밀고 일어섭니다.'
            ]
        },
        '덤벨 루마니안 데드리프트': {
            name: '덤벨 루마니안 데드리프트 (Dumbbell Romanian Deadlift)',
            exerciseId: 'rR0LJzx',
            bodyPart: '하체 - 대퇴이두 (Thighs/Hamstrings)',
            target: '햄스트링/둔근 (Hamstrings/Glutes)',
            equipment: '덤벨 (Dumbbell)',
            instructions: [
                '양손에 덤벨을 들고 상체를 곧게 세운 상태에서 고관절 힙 힌지를 시작합니다.',
                '덤벨을 허벅지에 부드럽게 붙여 무릎 아래까지 쓸어내리며 엉덩이를 뒤로 깊게 빼 줍니다.',
                '허벅지 뒤쪽 햄스트링에 강력한 이완 자극이 걸리면 엉덩이를 수축하며 원래 서있는 자세로 일어섭니다.'
            ]
        }
    };

    // 2. 등급별(헬린이/중고급자) 추천 알고리즘 로직
    
    // 헬린이용 고정 운동 리스트
    const helliniUpperRoutines = ['플라이 머신', '로우 인클라인 덤벨 프레스', '렛풀다운(뉴트럴 그립)', '롱풀(와이드 그립 일자 바)', '덤벨 숄더 프레스', '덤벨 사이드 레터럴 레이즈', '덤벨 컬', '케이블 트라이셉스 푸시 다운'];
    const helliniLowerRoutines = ['이너 타이', '레그 익스텐션', '시티드 레그 컬', '레그프레스', '루마니안 데드리프트', '핵스쿼트 머신'];

    // 헬소년 & 헬른 운동 풀(Pool) 분류
    const advancedPool = {
        '가슴': ['벤치프레스', '인클라인 덤벨프레스', '플라이 머신', '체스트 프레스 머신', '덤벨 플라이', '케이블 크로스오버', '딥스'], // 딥스를 풀의 맨 아래(마지막)에 배치
        '등': ['티바로우', '암풀다운', '바벨로우', '원암덤벨로우', '데드리프트', '렛풀다운(뉴트럴 그립)', '롱풀(와이드 그립 일자 바)'],
        '어깨': ['덤벨 리어 델트 플라이', '스미스 머신 숄더 프레스', '숄더 프레스 머신', '리버스 펙덱플라이', '케이블 업라이트 로우', '덤벨 사이드 레터럴 레이즈', '덤벨 프론트 레이즈'],
        '이두': ['바벨 컬', '이두 컬 머신', '케이블 컬'],
        '삼두': ['라잉 트라이셉스 익스텐션', '케이블 트라이셉스 익스텐션', '클로즈 그립 벤치프레스', '케이블 트라이셉스 푸시 다운'],
        '하체': ['스쿼트', '불가리안 스플릿 스쿼트', '레그프레스', '레그 익스텐션', '핵스쿼트 머신', '이너 타이'],
        '대퇴사두': ['스쿼트', '불가리안 스플릿 스쿼트', '레그프레스', '레그 익스텐션', '핵스쿼트 머신'],
        '대퇴이두': ['덤벨 루마니안 데드리프트', '시티드 레그 컬', '루마니안 데드리프트'],
        '팔': ['바벨 컬', '이두 컬 머신', '라잉 트라이셉스 익스텐션', '케이블 트라이셉스 익스텐션']
    };

    // 헬른(고급자)용 다중 루틴 옵션 정의
    const advancedRoutines = {
        4: [
            { id: 0, label: "4분할 (가슴, 등, 어깨, 하체)", hasWeakness: false, days: ['가슴', '등', '어깨', '하체'] },
            { id: 1, label: "밀기 / 당기기 / 하체 / 본인의 약점 부위", hasWeakness: true, days: ['밀기', '당기기', '하체', '약점'] }
        ],
        5: [
            { id: 0, label: "5분할 (가슴, 등, 어깨, 하체, 팔)", hasWeakness: false, days: ['가슴', '등', '어깨', '하체', '팔'] },
            { id: 1, label: "밀기 / 당기기 / 하체 / 밀기 / 당기기", hasWeakness: false, days: ['밀기', '당기기', '하체', '밀기', '당기기'] }
        ],
        6: [
            { id: 0, label: "6분할 (가슴, 등, 어깨, 하체, 팔, 본인의 약점 부위)", hasWeakness: true, days: ['가슴', '등', '어깨', '하체', '팔', '약점'] },
            { id: 1, label: "밀기 / 당기기 / 하체 / 밀기 / 당기기 / 하체 (2순환)", hasWeakness: false, days: ['밀기', '당기기', '하체', '밀기', '당기기', '하체'] },
            { id: 2, label: "가슴 / 등 / 어깨 / 하체 / 밀기 / 당기기", hasWeakness: false, days: ['가슴', '등', '어깨', '하체', '밀기', '당기기'] }
        ]
    };

    // 3. 주간 운동 횟수 선택 이벤트
    dayButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            dayButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.days = parseInt(btn.dataset.days);
            
            state.optionIndex = 0;
            updateAdvancedSection();
            checkInputs();
        });
    });

    // 4. 구력/체형 카드 선택 이벤트
    physiqueCards.forEach(card => {
        card.addEventListener('click', () => {
            physiqueCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            state.level = card.dataset.level;

            state.optionIndex = 0;
            updateAdvancedSection();
            checkInputs();
        });
    });

    // 5. 약점 부위 입력 이벤트
    weaknessInput.addEventListener('input', (e) => {
        state.weakness = e.target.value;
        checkInputs();
    });

    // 입력 상태 체크 및 버튼 활성화
    function checkInputs() {
        let isValid = state.days && state.level;
        
        if (state.level === 'advanced' && advancedRoutines[state.days]) {
            const currentOptions = advancedRoutines[state.days];
            const selectedOpt = currentOptions[state.optionIndex];
            if (selectedOpt && selectedOpt.hasWeakness) {
                isValid = isValid && state.weakness.trim() !== "";
            }
        }
        
        generateBtn.disabled = !isValid;
    }

    // 헬른(고급자) 옵션 패널 노출
    function updateAdvancedSection() {
        if (state.level === 'advanced' && advancedRoutines[state.days]) {
            advancedOptionsSection.classList.remove('hidden');
            renderAdvancedOptions(state.days);
        } else {
            advancedOptionsSection.classList.add('hidden');
            weaknessGroup.classList.add('hidden');
        }
    }

    // 헬른(고급자) 세부 옵션 생성
    function renderAdvancedOptions(days) {
        const options = advancedRoutines[days];
        routineOptionsContainer.innerHTML = '';
        
        options.forEach(opt => {
            const optBtn = document.createElement('button');
            optBtn.className = `option-btn ${state.optionIndex === opt.id ? 'active' : ''}`;
            optBtn.innerHTML = `
                <span class="option-radio"></span>
                <span>${opt.label}</span>
            `;
            
            optBtn.addEventListener('click', () => {
                state.optionIndex = opt.id;
                
                document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
                optBtn.classList.add('active');
                
                if (opt.hasWeakness) {
                    weaknessGroup.classList.remove('hidden');
                } else {
                    weaknessGroup.classList.add('hidden');
                    state.weakness = "";
                    weaknessInput.value = "";
                }
                
                checkInputs();
            });
            
            routineOptionsContainer.appendChild(optBtn);
        });

        const currentSelected = options[state.optionIndex];
        if (currentSelected && currentSelected.hasWeakness) {
            weaknessGroup.classList.remove('hidden');
        } else {
            weaknessGroup.classList.add('hidden');
        }
    }

    // 6. 루틴 생성 및 결과 출력
    generateBtn.addEventListener('click', () => {
        if (!state.days || !state.level) return;

        resultSection.classList.remove('hidden');
        resultSection.scrollIntoView({ behavior: 'smooth' });

        let lvlText = '';
        if (state.level === 'beginner') lvlText = '헬린이 (초급자)';
        else if (state.level === 'intermediate') lvlText = '헬소년 (중급자)';
        else if (state.level === 'advanced') lvlText = '헬른 (고급자)';
        resultSummary.textContent = `주 ${state.days}일 운동 | ${lvlText} 맞춤 루틴`;

        // 권장 세트수 가이드 동적 출력
        if (state.level === 'beginner') {
            setsGuideBox.innerHTML = "💡 <strong>권장 세트 안내:</strong> 헬린이(초급자)분들은 별도의 웜업 세트 없이 모든 운동을 <strong>각 4세트씩</strong> 수행하시면 됩니다. 정확한 자세와 자극을 익히는 것에 집중하세요!";
        } else {
            setsGuideBox.innerHTML = "💡 <strong>권장 세트 안내:</strong> 웜업 세트를 제외한 본 세트 기준으로 <strong>각 운동당 2~3세트씩</strong> 수행하시면 됩니다. 충분한 고강도 자극을 줄 수 있도록 통제해 보세요!";
        }

        const routine = getRoutineStructure();
        renderRoutineCards(routine);
    });

    // 조건별 루틴 부위 형태 획득 함수
    function getRoutineStructure() {
        const days = state.days;
        const level = state.level;

        if (level === 'beginner' || level === 'intermediate') {
            switch(days) {
                case 3: return ['상체', '하체', '상체'];
                case 4: return ['전면', '후면', '전면', '후면'];
                case 5: return ['밀기', '당기기', '하체', '밀기', '당기기'];
                case 6: return ['밀기', '당기기', '하체', '밀기', '당기기', '하체'];
            }
        } 
        else if (level === 'advanced') {
            if (days === 3) {
                return ['밀기', '당기기', '하체'];
            }
            const opt = advancedRoutines[days][state.optionIndex];
            if (opt) {
                return opt.days.map(d => {
                    if (d === '약점') {
                        return `약점 부위 (${state.weakness})`;
                    }
                    return d;
                });
            }
        }
        return [];
    }

    // 루틴 카드 생성 및 동적 운동 매핑
    function renderRoutineCards(routineStructure) {
        routineCardsContainer.innerHTML = '';
        
        routineStructure.forEach((dayRoutine, index) => {
            const card = document.createElement('div');
            card.className = 'routine-card';
            
            let icon = '💪';
            if (dayRoutine.includes('하체')) icon = '🦵';
            else if (dayRoutine.includes('가슴')) icon = '👕';
            else if (dayRoutine.includes('등')) icon = '🦅';
            else if (dayRoutine.includes('어깨')) icon = '🛡️';
            else if (dayRoutine.includes('팔')) icon = '🥊';

            card.innerHTML = `
                <div class="day-badge">DAY ${index + 1}</div>
                <h4>${icon} ${dayRoutine}</h4>
                <ul class="routine-details" id="details-day-${index}">
                </ul>
            `;
            routineCardsContainer.appendChild(card);

            // 해당 카드에 어울리는 한국어 세부 운동 목록 추출 및 렌더링
            generateExercisesForDay(dayRoutine, index);
        });
    }

    // 요일별 분할 구조에 알맞은 맞춤 운동 종목 생성
    function generateExercisesForDay(dayRoutine, cardIndex) {
        const detailsContainer = document.getElementById(`details-day-${cardIndex}`);
        let selectedExercises = [];

        // 헬린이인 경우: 엄밀하게 정해진 순서와 종목으로 구성
        if (state.level === 'beginner') {
            if (dayRoutine === '상체') {
                selectedExercises = [...helliniUpperRoutines];
            } 
            else if (dayRoutine === '하체') {
                selectedExercises = [...helliniLowerRoutines];
            } 
            else if (dayRoutine === '전면') {
                selectedExercises = [
                    '플라이 머신', '로우 인클라인 덤벨 프레스', 
                    '덤벨 숄더 프레스', '덤벨 사이드 레터럴 레이즈', 
                    '레그 익스텐션', '레그프레스', '핵스쿼트 머신',
                    '케이블 트라이셉스 푸시 다운'
                ];
            } 
            else if (dayRoutine === '후면') {
                selectedExercises = [
                    '렛풀다운(뉴트럴 그립)', '롱풀(와이드 그립 일자 바)', 
                    '시티드 레그 컬', '루마니안 데드리프트', '이너 타이',
                    '덤벨 컬'
                ];
            } 
            else if (dayRoutine === '밀기') {
                selectedExercises = ['플라이 머신', '로우 인클라인 덤벨 프레스', '덤벨 숄더 프레스', '덤벨 사이드 레터럴 레이즈', '케이블 트라이셉스 푸시 다운'];
            } 
            // 헬린이 당기기 세션에 등운동 2~3개 추가 (어시스트 풀업, 원암덤벨로우 추가하여 보강 완료)
            else if (dayRoutine === '당기기') {
                selectedExercises = ['렛풀다운(뉴트럴 그립)', '롱풀(와이드 그립 일자 바)', '어시스트 풀업', '원암덤벨로우', '덤벨 컬'];
            }
        } 
        // 헬소년/헬른인 경우: 가슴, 등, 어깨 4~5개 배치, 딥스는 가슴 마지막에 고정, 중복 제거
        else {
            if (dayRoutine === '가슴') {
                // 가슴 운동 5개: 딥스를 제외한 나머지에서 4개 추출 후 딥스를 마지막에 붙임 (총 5개)
                const chestWithoutDips = advancedPool['가슴'].filter(e => e !== '딥스');
                const selectedChest = getMultipleUnique(chestWithoutDips, 4);
                selectedExercises = [...selectedChest, '딥스'];
            } 
            else if (dayRoutine === '등') {
                // 등 운동 5개 셔플 및 추출
                selectedExercises = getMultipleUnique(advancedPool['등'], 5);
            } 
            else if (dayRoutine === '어깨') {
                // 어깨 운동 5개 셔플 및 추출
                selectedExercises = getMultipleUnique(advancedPool['어깨'], 5);
            } 
            else if (dayRoutine === '하체') {
                // 하체 6개: 대퇴사두 3개 + 대퇴이두 2개 + 이너 타이 결합하여 중복 제거
                const quads = getMultipleUnique(advancedPool['대퇴사두'], 3);
                const hams = getMultipleUnique(advancedPool['대퇴이두'], 2);
                selectedExercises = [...quads, ...hams, '이너 타이'];
            }
            else if (dayRoutine === '상체') {
                // 상체 날: 가슴 3개(딥스는 마지막 정렬) + 등 3개 + 어깨 2개 + 이두 1개 + 삼두 1개 (총 10개)
                const chest = getMultipleUnique(advancedPool['가슴'], 3);
                if (chest.includes('딥스')) {
                    const idx = chest.indexOf('딥스');
                    chest.splice(idx, 1);
                    chest.push('딥스');
                }
                const back = getMultipleUnique(advancedPool['등'], 3);
                const shoulders = getMultipleUnique(advancedPool['어깨'].filter(e => !e.includes('리어 델트') && e !== '리버스 펙덱플라이'), 2);
                const arms = [getRandom(advancedPool['이두']), getRandom(advancedPool['삼두'])];
                selectedExercises = [...chest, ...back, ...shoulders, ...arms];
            } 
            else if (dayRoutine === '전면') {
                // 전면 날: 가슴 3개(딥스는 마지막 정렬) + 어깨(전/측면) 2개 + 사두 3개 + 삼두 1개 (총 9개)
                const chest = getMultipleUnique(advancedPool['가슴'], 3);
                if (chest.includes('딥스')) {
                    const idx = chest.indexOf('딥스');
                    chest.splice(idx, 1);
                    chest.push('딥스');
                }
                const shoulders = getMultipleUnique(advancedPool['어깨'].filter(e => !e.includes('리어 델트') && e !== '리버스 펙덱플라이'), 2);
                const quads = getMultipleUnique(advancedPool['대퇴사두'], 3);
                const triceps = getMultipleUnique(advancedPool['삼두'], 1);
                selectedExercises = [...chest, ...shoulders, ...quads, ...triceps];
            } 
            else if (dayRoutine === '후면') {
                // 후면 날: 등 3개 + 어깨(후면) 2개 + 이두 1개 + 대퇴이두 2개 (총 8개)
                const back = getMultipleUnique(advancedPool['등'], 3);
                const rearDelt = getMultipleUnique(advancedPool['어깨'].filter(e => e.includes('리어 델트') || e === '리버스 펙덱플라이'), 2);
                const biceps = getMultipleUnique(advancedPool['이두'], 1);
                const hams = getMultipleUnique(advancedPool['대퇴이두'], 2);
                selectedExercises = [...back, ...rearDelt, ...biceps, ...hams];
            } 
            else if (dayRoutine === '밀기') {
                // 밀기 날: 가슴 3개(딥스는 마지막 정렬) + 어깨(전/측면) 2개 + 삼두 2개 (총 7개)
                const chest = getMultipleUnique(advancedPool['가슴'], 3);
                if (chest.includes('딥스')) {
                    const idx = chest.indexOf('딥스');
                    chest.splice(idx, 1);
                    chest.push('딥스');
                }
                const shoulders = getMultipleUnique(advancedPool['어깨'].filter(e => !e.includes('리어 델트') && e !== '리버스 펙덱플라이'), 2);
                const triceps = getMultipleUnique(advancedPool['삼두'], 2);
                selectedExercises = [...chest, ...shoulders, ...triceps];
            } 
            else if (dayRoutine === '당기기') {
                // 당기기 날: 등 3개 + 이두 2개 + 어깨(후면) 1개 (총 6개)
                const back = getMultipleUnique(advancedPool['등'], 3);
                const biceps = getMultipleUnique(advancedPool['이두'], 2);
                const rearDelt = getMultipleUnique(advancedPool['어깨'].filter(e => e.includes('리어 델트') || e === '리버스 펙덱플라이'), 1);
                selectedExercises = [...back, ...biceps, ...rearDelt];
            }
            else if (dayRoutine === '팔') {
                selectedExercises = [
                    ...getMultipleUnique(advancedPool['이두'], 2),
                    ...getMultipleUnique(advancedPool['삼두'], 2)
                ];
            } 
            else if (dayRoutine.startsWith('약점 부위')) {
                const parts = findMappingParts(state.weakness);
                const poolKey = parts[0];
                if (poolKey === '가슴') {
                    const chestWithoutDips = advancedPool['가슴'].filter(e => e !== '딥스');
                    const selectedChest = getMultipleUnique(chestWithoutDips, 4);
                    selectedExercises = [...selectedChest, '딥스'];
                } else if (poolKey === '등' || poolKey === '어깨') {
                    selectedExercises = getMultipleUnique(advancedPool[poolKey], 5);
                } else {
                    selectedExercises = getMultipleUnique(advancedPool[poolKey] || advancedPool['어깨'], 4);
                }
            }
        }

        // 최종 중복 제거 및 유효 필터링
        selectedExercises = Array.from(new Set(selectedExercises)).filter(Boolean);

        // DOM 렌더링
        detailsContainer.innerHTML = '';
        selectedExercises.forEach(exName => {
            const ex = exerciseDatabase[exName];
            if (ex) {
                const li = document.createElement('li');
                
                // 세트수 노출 정의
                let setInfo = '';
                if (state.level === 'beginner') {
                    setInfo = '4세트';
                } else {
                    setInfo = '2~3세트';
                }

                li.innerHTML = `
                    <span class="exercise-name-text">${ex.name}</span>
                    <div class="exercise-meta-info">
                        <span class="set-badge">${setInfo}</span>
                        <span class="detail-part">${ex.bodyPart.split(' ')[0]} ➜</span>
                    </div>
                `;
                li.addEventListener('click', () => {
                    openExerciseDetailModal(ex);
                });
                detailsContainer.appendChild(li);
            }
        });
    }

    // 중복 방지 운동 추출 헬퍼 (풀에서 무작위 셔플 후 필요한 개수만큼 슬라이싱)
    function getMultipleUnique(pool, count) {
        const shuffled = shuffleArray([...pool]);
        return shuffled.slice(0, count);
    }

    // 배열 셔플 유틸리티
    function shuffleArray(arr) {
        return arr.sort(() => 0.5 - Math.random());
    }

    // 배열 내의 랜덤 단일 인자 추출
    function getRandom(arr) {
        if (!arr || arr.length === 0) return '';
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // 약점 입력 단어 분석 파트 키 획득
    function findMappingParts(koreanText) {
        if (koreanText.includes('가슴')) return ['가슴'];
        if (koreanText.includes('등') || koreanText.includes('광배')) return ['등'];
        if (koreanText.includes('어깨') || koreanText.includes('삼각') || koreanText.includes('후면')) return ['어깨'];
        if (koreanText.includes('다리') || koreanText.includes('하체') || koreanText.includes('허벅지') || koreanText.includes('스쿼트')) return ['대퇴사두'];
        if (koreanText.includes('햄스트') || koreanText.includes('대퇴이두') || koreanText.includes('뒤')) return ['대퇴이두'];
        if (koreanText.includes('팔') || koreanText.includes('삼두') || koreanText.includes('이두')) return ['팔'];
        return ['어깨'];
    }

    // 7. 운동 상세 정보 모달 열기 (OSS API 및 캐시 지원)
    // 🔑 API Key가 필요 없는 무료 oss.exercisedb.dev 서버를 연동하여 동작 영상(GIF) 및 썸네일을 실시간으로 가져옵니다.
        // 7. 운동 상세 정보 모달 열기 (OSS API 및 캐시 지원)
    // 🔑 API Key가 필요 없는 무료 oss.exercisedb.dev 서버의 CDN을 연동하여 동작 영상(GIF)을 실시간으로 가져옵니다.
    function openExerciseDetailModal(ex) {
        detailName.textContent = ex.name;
        
        detailGif.classList.add('hidden');
        gifLoader.classList.remove('hidden');
        
        detailGif.onerror = () => {
            detailGif.src = 'https://github.com/hasaneyldrm/exercises-dataset/raw/main/images/0088-1ZFqTDN.jpg';
            gifLoader.classList.add('hidden');
            detailGif.classList.remove('hidden');
        };

        // CDN에서 직접 운동 동작 GIF 로드
        detailGif.src = `https://static.exercisedb.dev/media/${ex.exerciseId}.gif`;
        detailGif.onload = () => {
            gifLoader.classList.add('hidden');
            detailGif.classList.remove('hidden');
        };

        detailBodyPart.textContent = ex.bodyPart;
        detailTarget.textContent = ex.target;
        detailEquipment.textContent = ex.equipment;

        detailInstructions.innerHTML = '';
        ex.instructions.forEach(step => {
            const li = document.createElement('li');
            li.textContent = step;
            detailInstructions.appendChild(li);
        });

        modalDetail.classList.remove('hidden');
    }
    // 상세 모달 닫기
    btnCloseDetailModal.addEventListener('click', () => {
        modalDetail.classList.add('hidden');
        detailGif.src = '';
    });

    // 바깥쪽 클릭 시 닫기
    window.addEventListener('click', (e) => {
        if (e.target === modalDetail) {
            modalDetail.classList.add('hidden');
            detailGif.src = '';
        }
    });



    // ==========================================
    // 운동일지 (Workout Log) 기능 개발 로직
    // ==========================================

    // 1. 로컬 스토리지 로그 리스트 로드 및 마이그레이션
    let workoutLogs = JSON.parse(localStorage.getItem('workout_logs')) || [];
    workoutLogs = workoutLogs.map(entry => {
        // 이전 구조(단일 무게/세트/횟수)가 존재하면 세트 배열로 변환
        if (entry.weight !== undefined && entry.sets !== undefined && !Array.isArray(entry.sets)) {
            const setsArray = [];
            const setNum = entry.sets || 4;
            for (let i = 1; i <= setNum; i++) {
                setsArray.push({ setId: i, weight: entry.weight, reps: entry.reps || 10 });
            }
            return {
                id: entry.id,
                date: entry.date,
                korName: entry.korName,
                exerciseId: entry.exerciseId,
                sets: setsArray
            };
        }
        return entry;
    });
    localStorage.setItem('workout_logs', JSON.stringify(workoutLogs));
    
    // 로컬 스토리지 커스텀 운동 리스트 로드
    let customExercises = JSON.parse(localStorage.getItem('custom_exercises')) || [];

    // 1,300+ 운동 풀 전역 객체
    let globalExercisePool = [];

    // exercises_db.json 파일 비동기 로드
    fetch('exercises_db.json')
        .then(response => {
            if (!response.ok) throw new Error("네트워크 응답이 올바르지 않습니다.");
            return response.json();
        })
        .then(data => {
            // 커스텀 운동과 병합
            globalExercisePool = [...customExercises, ...data];
            console.log(`[전체 운동 DB 로드 완료] 총 ${globalExercisePool.length}개 운동 탑재 완료 (커스텀 ${customExercises.length}개).`);
        })
        .catch(err => {
            console.error("운동 데이터베이스 로드 실패. 내장 41개 데이터셋으로 검색을 보완합니다.", err);
            // Fallback: 내장 DB를 검색용으로 변환
            const fallbackList = Object.keys(exerciseDatabase).map(key => {
                const ex = exerciseDatabase[key];
                // 카테고리 매핑
                let cat = "가슴";
                const bp = (ex.bodyPart || "").toLowerCase();
                if (bp.includes("back")) cat = "등";
                else if (bp.includes("shoulder")) cat = "어깨";
                else if (bp.includes("leg")) cat = "하체";
                else if (bp.includes("arm")) cat = "팔";
                else if (bp.includes("waist") || bp.includes("abs")) cat = "복근";
                
                return {
                    exerciseId: ex.exerciseId,
                    name: ex.name,
                    nameKr: key,
                    category: cat,
                    bodyPart: ex.bodyPart,
                    target: ex.target,
                    equipment: ex.equipment,
                    instructions: ex.instructions
                };
            });
            globalExercisePool = [...customExercises, ...fallbackList];
        });

    // 날짜 설정 기본값 (오늘 날짜 YYYY-MM-DD)
    const logDateInput = document.getElementById('log-date');
    if (logDateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        logDateInput.value = `${yyyy}-${mm}-${dd}`;
    }

    // 탭 전환 처리
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const targetTab = btn.dataset.tab;
            tabContents.forEach(content => {
                if (content.id === `section-${targetTab}`) {
                    content.classList.remove('hidden');
                } else {
                    content.classList.add('hidden');
                }
            });
        });
    });

    // 2. 부위 선택 카테고리 필터링 제어
    const catButtons = document.querySelectorAll('.log-cat-btn');
    let activeCategory = null;

    catButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const wasActive = btn.classList.contains('active');
            catButtons.forEach(b => b.classList.remove('active'));
            
            if (wasActive) {
                activeCategory = null;
            } else {
                btn.classList.add('active');
                activeCategory = btn.dataset.category;
            }
            
            // 카테고리 선택/해제 시 자동완성/추천 영역 갱신
            updateAutocompleteList();
        });
    });

    // 3. 자동완성 검색 및 연관 추천 로직
    const logSearchInput = document.getElementById('log-search-input');
    const logAutocompleteList = document.getElementById('log-autocomplete-list');
    const previewCard = document.getElementById('selected-exercise-preview');
    const previewName = document.getElementById('preview-exercise-name');
    const previewBodyPart = document.getElementById('preview-exercise-bodypart');
    const previewGif = document.getElementById('preview-exercise-gif');
    const previewLoader = document.getElementById('preview-gif-loader');
    const btnAddLog = document.getElementById('btn-add-log');
    let selectedExerciseForLog = null;

    function updateAutocompleteList() {
        if (!logAutocompleteList) return;
        logAutocompleteList.innerHTML = '';

        const searchVal = logSearchInput ? logSearchInput.value.trim() : '';
        
        // 검색어도 없고 카테고리도 선택 안 된 경우 닫음
        if (!searchVal && !activeCategory) {
            logAutocompleteList.classList.add('hidden');
            return;
        }

        // 연관 검색 매칭 (공백 분할 검색)
        const searchTerms = searchVal.toLowerCase().split(/\s+/).filter(x => x);

        const matches = globalExercisePool.filter(item => {
            // 카테고리 매칭
            if (activeCategory && item.category !== activeCategory) {
                return false;
            }
            // 검색어 매칭
            if (searchTerms.length > 0) {
                const nameKrNorm = item.nameKr.toLowerCase().replace(/\s+/g, '');
                const nameNorm = item.name.toLowerCase().replace(/\s+/g, '');
                return searchTerms.every(term => {
                    const termNorm = term.replace(/\s+/g, '');
                    return nameKrNorm.includes(termNorm) || nameNorm.includes(termNorm);
                });
            }
            // 검색어는 없고 카테고만 있는 경우
            return true;
        });

        if (matches.length === 0) {
            logAutocompleteList.classList.add('hidden');
            return;
        }

        logAutocompleteList.classList.remove('hidden');
        
        // 최대 15개 제안 노출 (스크롤 가능)
        matches.slice(0, 15).forEach(item => {
            const div = document.createElement('div');
            div.className = 'autocomplete-item';
            div.innerHTML = `
                <div style="display: flex; flex-direction: column; text-align: left;">
                    <span style="font-weight: 600; color: #fff;">${item.nameKr}</span>
                    <span style="font-size: 0.75rem; color: var(--text-secondary);">${item.name}</span>
                </div>
                <span class="autocomplete-item-part" style="background: rgba(0, 102, 255, 0.15); color: var(--accent); padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; font-weight: bold;">${item.category}</span>
            `;
            div.addEventListener('click', () => {
                logSearchInput.value = item.nameKr;
                selectedExerciseForLog = item;
                logAutocompleteList.classList.add('hidden');
                
                // 미리보기 카드 갱신
                previewCard.classList.remove('hidden');
                previewName.textContent = item.nameKr;
                previewBodyPart.textContent = item.category;
                
                previewGif.src = '';
                previewLoader.classList.remove('hidden');
                
                // GIF 소스 바인딩 (커스텀 이미지 번역 처리 포함)
                if (item.exerciseId.startsWith('custom_')) {
                    // 커스텀 운동의 경우 매핑된 이미지
                    previewGif.src = item.gifUrl || '';
                } else {
                    previewGif.src = `https://static.exercisedb.dev/media/${item.exerciseId}.gif`;
                }
                
                previewGif.onload = () => {
                    previewLoader.classList.add('hidden');
                };
                previewGif.onerror = () => {
                    previewGif.src = 'https://github.com/hasaneyldrm/exercises-dataset/raw/main/images/0088-1ZFqTDN.jpg';
                    previewLoader.classList.add('hidden');
                };

                btnAddLog.disabled = false;
            });
            logAutocompleteList.appendChild(div);
        });
    }

    if (logSearchInput) {
        logSearchInput.addEventListener('input', updateAutocompleteList);
        
        // 검색창에 포커스를 주었을 때 카테고리가 켜져 있다면 바로 목록을 보여줌
        logSearchInput.addEventListener('focus', () => {
            if (activeCategory || logSearchInput.value.trim()) {
                updateAutocompleteList();
            }
        });

        // 자동완성 드롭다운 바깥 클릭 시 닫기
        document.addEventListener('click', (e) => {
            if (e.target !== logSearchInput && e.target !== logAutocompleteList && !logAutocompleteList.contains(e.target)) {
                logAutocompleteList.classList.add('hidden');
            }
        });
    }

    // 4. 커스텀 운동 직접 등록 제어
    const btnToggleCustom = document.getElementById('btn-toggle-custom');
    const customExerciseForm = document.getElementById('custom-exercise-form');
    const btnSubmitCustom = document.getElementById('btn-submit-custom');
    const customExNameInput = document.getElementById('custom-ex-name');
    const customExCategoryInput = document.getElementById('custom-ex-category');

    if (btnToggleCustom && customExerciseForm) {
        btnToggleCustom.addEventListener('click', () => {
            customExerciseForm.classList.toggle('hidden');
        });
    }

    if (btnSubmitCustom) {
        btnSubmitCustom.addEventListener('click', () => {
            const name = customExNameInput.value.trim();
            const category = customExCategoryInput.value;
            
            if (!name) {
                alert("운동 이름을 입력해 주세요!");
                return;
            }
            
            // 중복 검사
            const isDuplicate = globalExercisePool.some(item => item.nameKr.toLowerCase() === name.toLowerCase());
            if (isDuplicate) {
                alert("이미 존재하는 운동 이름입니다!");
                return;
            }

            // 스마트 이미지 매핑 규칙
            let mappedGifId = "0088"; // 기본 스쿼트
            const nameLower = name.toLowerCase();
            
            if (nameLower.includes("로우로우") || nameLower.includes("로우 로우") || nameLower.includes("row row") || (nameLower.includes("로우") && !nameLower.includes("하이"))) {
                mappedGifId = "0237"; // cable seated row
            } else if (nameLower.includes("하이로우") || nameLower.includes("하이 로우") || nameLower.includes("high row")) {
                mappedGifId = "0172"; // cable lat pulldown
            } else if (nameLower.includes("레그프레스") || nameLower.includes("leg press")) {
                mappedGifId = "0585"; // sled leg press
            } else if (nameLower.includes("숄더프레스") || nameLower.includes("shoulder press") || nameLower.includes("오버헤드")) {
                mappedGifId = "0347"; // dumbbell shoulder press
            } else if (nameLower.includes("벤치프레스") || nameLower.includes("chest press") || nameLower.includes("체스트 프레스")) {
                mappedGifId = "0025"; // barbell bench press
            } else {
                // 카테고리별 디폴트
                if (category === "가슴") mappedGifId = "0025";
                else if (category === "등") mappedGifId = "0172";
                else if (category === "어깨") mappedGifId = "0347";
                else if (category === "하체") mappedGifId = "0088";
                else if (category === "팔") mappedGifId = "0344"; // dumbbell bicep curl
                else if (category === "복근") mappedGifId = "0001"; // 3/4 sit-up
            }

            const customId = `custom_${Date.now()}`;
            const newCustom = {
                exerciseId: customId,
                name: name,
                nameKr: name,
                category: category,
                bodyPart: category === "하체" ? "Upper Legs" : category === "등" ? "Back" : category === "어깨" ? "Shoulders" : category === "팔" ? "Upper Arms" : category === "복근" ? "Waist" : "Chest",
                target: category === "가슴" ? "Pectorals" : category === "등" ? "Lats" : "Abs",
                equipment: "Machine",
                instructions: ["직접 등록한 커스텀 운동입니다. 부드럽게 세트를 설정하여 일지를 기입해 보세요."],
                gifUrl: `https://static.exercisedb.dev/media/${mappedGifId}.gif`
            };

            customExercises.unshift(newCustom);
            localStorage.setItem('custom_exercises', JSON.stringify(customExercises));
            
            // 메모리 병합 및 즉시 적용
            globalExercisePool.unshift(newCustom);
            
            alert(`'${name}' 운동이 등록되었습니다!`);
            
            // 입력창 초기화 및 자동완성에 바로 주입
            customExNameInput.value = '';
            customExerciseForm.classList.add('hidden');
            
            // 검색어에 세팅
            logSearchInput.value = name;
            selectedExerciseForLog = newCustom;
            
            // 미리보기 즉시 활성화
            previewCard.classList.remove('hidden');
            previewName.textContent = name;
            previewBodyPart.textContent = category;
            previewGif.src = newCustom.gifUrl;
            previewLoader.classList.add('hidden');
            
            btnAddLog.disabled = false;
        });
    }

    // 5. 일지 기록하기 (등록)
    if (btnAddLog) {
        btnAddLog.addEventListener('click', () => {
            if (!selectedExerciseForLog) return;

            const date = logDateInput.value;
            
            // 디폴트로 1세트(40kg x 10회)를 기입하여 카드 생성
            const newEntry = {
                id: Date.now(),
                date: date,
                korName: selectedExerciseForLog.nameKr,
                exerciseId: selectedExerciseForLog.exerciseId,
                sets: [
                    { setId: 1, weight: 40, reps: 10 }
                ]
            };

            workoutLogs.push(newEntry);
            localStorage.setItem('workout_logs', JSON.stringify(workoutLogs));

            // 등록 후 필드 초기화
            logSearchInput.value = '';
            previewCard.classList.add('hidden');
            previewGif.src = '';
            selectedExerciseForLog = null;
            btnAddLog.disabled = true;

            renderLogsTimeline();
        });
    }

    // 6. 일지 타임라인 렌더링
    const logsTimeline = document.getElementById('logs-timeline');
    const btnClearLogs = document.getElementById('btn-clear-logs');
    let draggedCardId = null;

    function renderLogsTimeline() {
        if (!logsTimeline) return;
        logsTimeline.innerHTML = '';

        if (workoutLogs.length === 0) {
            logsTimeline.innerHTML = `
                <div class="empty-log-message">
                    <span class="empty-icon">📅</span>
                    <p>아직 기록된 운동 일지가 없습니다.</p>
                    <p class="sub-text">왼쪽 폼에서 오늘 한 운동을 기록해 보세요!</p>
                </div>
            `;
            return;
        }

        // 날짜 내림차순 정렬
        const groupedByDate = {};
        workoutLogs.forEach(entry => {
            if (!groupedByDate[entry.date]) {
                groupedByDate[entry.date] = [];
            }
            groupedByDate[entry.date].push(entry);
        });

        const sortedDates = Object.keys(groupedByDate).sort((a, b) => new Date(b) - new Date(a));

        sortedDates.forEach(date => {
            const dateGroup = document.createElement('div');
            dateGroup.className = 'log-day-group';

            const header = document.createElement('div');
            header.className = 'log-date-header';
            header.textContent = date;
            dateGroup.appendChild(header);

            const list = document.createElement('div');
            list.className = 'log-items-list';

            groupedByDate[date].forEach(entry => {
                const card = document.createElement('div');
                card.className = 'log-item-card';
                card.setAttribute('draggable', 'true');
                card.setAttribute('data-id', entry.id);
                card.setAttribute('data-date', date);
                
                const gifSrc = entry.exerciseId.startsWith('custom_') 
                    ? (globalExercisePool.find(ex => ex.exerciseId === entry.exerciseId)?.gifUrl || 'https://github.com/hasaneyldrm/exercises-dataset/raw/main/images/0088-1ZFqTDN.jpg')
                    : `https://static.exercisedb.dev/media/${entry.exerciseId}.gif`;

                card.innerHTML = `
                    <div class="drag-handle">⋮⋮</div>
                    <div class="log-thumbnail-wrapper">
                        <img src="${gifSrc}" alt="${entry.korName}" class="log-thumbnail" onerror="this.src='https://github.com/hasaneyldrm/exercises-dataset/raw/main/images/0088-1ZFqTDN.jpg'">
                    </div>
                    <div class="log-info" style="flex: 1;">
                        <h5 style="margin: 0; font-size: 0.95rem; font-weight: bold;">${entry.korName}</h5>
                        
                        <!-- 세트별 입력 리스트 -->
                        <div class="log-sets-section">
                            <div class="log-set-list" data-log-id="${entry.id}">
                                ${entry.sets.map((set, idx) => `
                                    <div class="log-set-row" data-set-id="${set.setId}" style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
                                        <span class="log-set-num" style="font-size: 0.75rem; color: var(--accent); min-width: 35px;">${idx + 1}세트</span>
                                        <div class="log-set-input-group" style="display: flex; align-items: center; gap: 2px;">
                                            <input type="number" class="log-set-input set-weight" data-log-id="${entry.id}" data-set-id="${set.setId}" value="${set.weight}" min="0" step="0.5" style="width: 50px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; color: #fff; text-align: center; padding: 2px 4px; font-size: 0.8rem;">
                                            <span style="font-size: 0.75rem; color: var(--text-secondary);">kg</span>
                                        </div>
                                        <div class="log-set-input-group" style="display: flex; align-items: center; gap: 2px;">
                                            <input type="number" class="log-set-input set-reps" data-log-id="${entry.id}" data-set-id="${set.setId}" value="${set.reps}" min="1" style="width: 45px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; color: #fff; text-align: center; padding: 2px 4px; font-size: 0.8rem;">
                                            <span style="font-size: 0.75rem; color: var(--text-secondary);">회</span>
                                        </div>
                                        <button class="btn-delete-set" data-log-id="${entry.id}" data-set-id="${set.setId}" style="background: none; border: none; color: #ff4d4d; cursor: pointer; padding: 2px 4px; font-size: 0.8rem; font-weight: bold; margin-left: auto;">✕</button>
                                    </div>
                                `).join('')}
                            </div>
                            <button class="btn-add-set" data-log-id="${entry.id}" style="width: 100%; margin-top: 6px; background: rgba(255,255,255,0.05); border: 1px dashed rgba(255,255,255,0.15); color: var(--text-secondary); border-radius: 4px; padding: 4px; font-size: 0.75rem; font-weight: 600; cursor: pointer; transition: all 0.2s;">+ 세트 추가</button>
                        </div>
                    </div>
                    <button class="log-delete-btn" data-id="${entry.id}">✕</button>
                `;

                // HTML5 Drag & Drop 이벤트 바인딩
                card.addEventListener('dragstart', (e) => {
                    draggedCardId = entry.id;
                    card.classList.add('dragging');
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/plain', entry.id);
                });

                card.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    const targetCard = e.currentTarget;
                    if (targetCard.dataset.date === date && parseInt(targetCard.dataset.id) !== draggedCardId) {
                        targetCard.classList.add('drag-over');
                    }
                });

                card.addEventListener('dragleave', (e) => {
                    e.currentTarget.classList.remove('drag-over');
                });

                card.addEventListener('drop', (e) => {
                    e.preventDefault();
                    const targetCard = e.currentTarget;
                    targetCard.classList.remove('drag-over');
                    
                    const draggedId = parseInt(e.dataTransfer.getData('text/plain'));
                    const targetId = parseInt(targetCard.dataset.id);

                    if (draggedId !== targetId && targetCard.dataset.date === date) {
                        const draggedIdx = workoutLogs.findIndex(item => item.id === draggedId);
                        const targetIdx = workoutLogs.findIndex(item => item.id === targetId);
                        
                        if (draggedIdx !== -1 && targetIdx !== -1) {
                            const [draggedItem] = workoutLogs.splice(draggedIdx, 1);
                            workoutLogs.splice(targetIdx, 0, draggedItem);
                            
                            localStorage.setItem('workout_logs', JSON.stringify(workoutLogs));
                            renderLogsTimeline();
                        }
                    }
                });

                card.addEventListener('dragend', () => {
                    card.classList.remove('dragging');
                    document.querySelectorAll('.log-item-card').forEach(c => c.classList.remove('drag-over'));
                });

                // 개별 운동 카드 삭제
                card.querySelector('.log-delete-btn').addEventListener('click', (e) => {
                    const idToDelete = parseInt(e.target.dataset.id);
                    workoutLogs = workoutLogs.filter(item => item.id !== idToDelete);
                    localStorage.setItem('workout_logs', JSON.stringify(workoutLogs));
                    renderLogsTimeline();
                });

                list.appendChild(card);
            });

            dateGroup.appendChild(list);
            logsTimeline.appendChild(dateGroup);
        });
    }

    // 7. 실시간 세트 데이터 업데이트 및 관리
    if (logsTimeline) {
        // 인풋 필드 값 변경 시 실시간 로컬 데이터 갱신 (리렌더링은 호출하지 않아 포커스 보존)
        logsTimeline.addEventListener('input', (e) => {
            if (e.target.classList.contains('log-set-input')) {
                const logId = parseInt(e.target.dataset.logId);
                const setId = parseInt(e.target.dataset.setId);
                const value = parseFloat(e.target.value);

                const logIdx = workoutLogs.findIndex(item => item.id === logId);
                if (logIdx !== -1) {
                    const setIdx = workoutLogs[logIdx].sets.findIndex(s => s.setId === setId);
                    if (setIdx !== -1) {
                        if (e.target.classList.contains('set-weight')) {
                            workoutLogs[logIdx].sets[setIdx].weight = isNaN(value) ? 0 : value;
                        } else if (e.target.classList.contains('set-reps')) {
                            workoutLogs[logIdx].sets[setIdx].reps = isNaN(value) ? 1 : Math.max(1, parseInt(value));
                        }
                        localStorage.setItem('workout_logs', JSON.stringify(workoutLogs));
                    }
                }
            }
        });

        // 세트 추가 / 삭제 버튼 클릭 핸들링 (이벤트 위임)
        logsTimeline.addEventListener('click', (e) => {
            // 세트 추가 버튼
            if (e.target.classList.contains('btn-add-set')) {
                const logId = parseInt(e.target.dataset.logId);
                const logIdx = workoutLogs.findIndex(item => item.id === logId);
                if (logIdx !== -1) {
                    const sets = workoutLogs[logIdx].sets;
                    const lastSet = sets[sets.length - 1] || { weight: 40, reps: 10 };
                    const nextId = sets.length > 0 ? Math.max(...sets.map(s => s.setId)) + 1 : 1;
                    
                    // 직전 세트 무게/횟수를 복사하여 새 세트 생성
                    sets.push({ setId: nextId, weight: lastSet.weight, reps: lastSet.reps });
                    localStorage.setItem('workout_logs', JSON.stringify(workoutLogs));
                    renderLogsTimeline();
                }
            }

            // 세트 삭제 버튼
            if (e.target.classList.contains('btn-delete-set')) {
                const logId = parseInt(e.target.dataset.logId);
                const setId = parseInt(e.target.dataset.setId);
                const logIdx = workoutLogs.findIndex(item => item.id === logId);
                
                if (logIdx !== -1) {
                    const sets = workoutLogs[logIdx].sets;
                    if (sets.length > 1) {
                        workoutLogs[logIdx].sets = sets.filter(s => s.setId !== setId);
                        localStorage.setItem('workout_logs', JSON.stringify(workoutLogs));
                        renderLogsTimeline();
                    } else {
                        alert("최소 1세트는 유지되어야 합니다. 카드를 삭제하려면 오른쪽 위의 '✕' 버튼을 눌러주세요.");
                    }
                }
            }
        });
    }

    // 전체 삭제 이벤트
    if (btnClearLogs) {
        btnClearLogs.addEventListener('click', () => {
            if (workoutLogs.length === 0) return;
            if (confirm("정말 모든 운동 일지를 삭제하시겠습니까?")) {
                workoutLogs = [];
                localStorage.setItem('workout_logs', JSON.stringify(workoutLogs));
                renderLogsTimeline();
            }
        });
    }

    // 초기 타임라인 렌더링
    renderLogsTimeline();
});
