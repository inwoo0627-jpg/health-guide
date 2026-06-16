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
            exerciseId: '0170',
            bodyPart: '가슴',
            target: '대흉근',
            equipment: '머신',
            instructions: [
                '머신 안쪽에 엉덩이와 등을 등받이에 완벽히 밀착해 앉습니다.',
                '패드를 양손으로 감싸 쥐고 팔꿈치를 살짝 굽혀 고정합니다.',
                '가슴 근육(겨드랑이 안쪽)에 힘을 주며 원을 그리듯 패드를 안쪽으로 모아줍니다.',
                '가슴 근육의 팽팽한 저항을 느끼며 천천히 시작 자세로 돌려보냅니다.'
            ]
        },
        '로우 인클라인 덤벨 프레스': {
            name: '로우 인클라인 덤벨 프레스 (Low Incline Dumbbell Press) - 10~15도 권장',
            exerciseId: '0314',
            bodyPart: '가슴',
            target: '쇄골부 대흉근',
            equipment: '덤벨',
            instructions: [
                '인클라인 벤치 각도를 약 10~15도(낮은 각도)로 조절한 뒤 눕습니다.',
                '덤벨을 쇄골 아랫부분 수직선상에 두고 팔꿈치를 가슴 옆에 둡니다.',
                '가슴 상부의 수축을 느끼며 덤벨을 천장 방향으로 수직으로 밀어 올립니다.',
                '덤벨이 흔들리지 않게 주의하며 천천히 저항을 느끼며 가슴 옆으로 내립니다.'
            ]
        },
        '인클라인 덤벨 프레스': {
            name: '인클라인 덤벨 프레스 (Incline Dumbbell Press)',
            exerciseId: '0314',
            bodyPart: '가슴',
            target: '상부 대흉근',
            equipment: '덤벨',
            instructions: [
                '각도를 높인 벤치(약 30~45도)에 누워 덤벨을 쇄골 윗부분 수직선상에 둡니다.',
                '가슴 상부의 수축을 느끼며 덤벨을 천장 방향으로 수직으로 밀어 올립니다.',
                '덤벨이 흔들리지 않게 주의하며 천천히 저항을 느끼며 내립니다.'
            ]
        },
        '어시스트 딥스': {
            name: '어시스트 딥스 (Assisted Dips)',
            exerciseId: '0009',
            bodyPart: '가슴',
            target: '하부 대흉근/삼두',
            equipment: '머신',
            instructions: [
                '어시스트 딥스 머신 무릎 패드에 무릎을 거치하고 핸들을 잡습니다.',
                '상체를 약간 앞으로 숙이고 팔꿈치를 굽혀 하부 가슴의 이완을 느끼며 내립니다.',
                '가슴 하부와 삼두의 힘으로 몸을 위로 강하게 밀어 올려줍니다.'
            ]
        },
        '렛풀다운': {
            name: '렛풀다운 (Lat Pulldown)',
            exerciseId: '0172',
            bodyPart: '등',
            target: '광배근',
            equipment: '케이블',
            instructions: [
                '바를 어깨너비보다 넓게 잡고 허벅지를 패드에 단단히 고정하여 앉습니다.',
                '쇄골 윗부분 방향으로 바를 강하게 당겨주며 광배근을 수축합니다.',
                '긴장을 유지하면서 천천히 팔을 펴주며 이완합니다.'
            ]
        },
        '롱풀': {
            name: '롱풀 (Seated Cable Row)',
            exerciseId: '0237',
            bodyPart: '등',
            target: '등 상부/광배근',
            equipment: '케이블',
            instructions: [
                '발 지지대에 발을 대고 일자 바 또는 그립을 잡습니다.',
                '가슴을 열고 척추를 곧게 세운 채 배꼽 방향으로 당깁니다.',
                '날개뼈를 접어 수축을 유도하고 천천히 이완합니다.'
            ]
        },
        '어시스트 풀업': {
            name: '어시스트 풀업 (Assisted Pull-up)',
            exerciseId: '0015',
            bodyPart: '등',
            target: '광배근',
            equipment: '머신',
            instructions: [
                '패드에 무릎을 대고 가슴을 연 채 바를 넓게 잡습니다.',
                '날개뼈를 내리며 광배근 힘으로 몸을 올려줍니다.',
                '천천히 긴장을 느끼며 원래 자세로 내려옵니다.'
            ]
        },
        '덤벨 숄더 프레스': {
            name: '덤벨 숄더 프레스 (Dumbbell Shoulder Press)',
            exerciseId: '0347',
            bodyPart: '어깨',
            target: '전면 삼각근',
            equipment: '덤벨',
            instructions: [
                '벤치 각도를 세우고 앉아 덤벨을 귀 옆 높이에 둡니다.',
                '어깨 힘으로 덤벨을 천장 방향으로 밀어 올립니다.',
                '천천히 자극을 느끼며 귀 옆으로 내립니다.'
            ]
        },
        '덤벨 사이드 레터럴 레이즈': {
            name: '덤벨 사이드 레터럴 레이즈 (Dumbbell Side Lateral Raise)',
            exerciseId: '0334',
            bodyPart: '어깨',
            target: '측면 삼각근',
            equipment: '덤벨',
            instructions: [
                '가슴을 펴고 똑바로 서서 어깨 관절 힘으로 덤벨을 옆으로 들어 올립니다.',
                '어깨 높이까지 올렸다가 긴장을 느끼며 서서히 내립니다.'
            ]
        },
        '덤벨 컬': {
            name: '덤벨 컬 (Dumbbell Curl)',
            exerciseId: '0294',
            bodyPart: '팔',
            target: '상완이두근',
            equipment: '덤벨',
            instructions: [
                '서서 덤벨을 양손에 쥐고 손바닥이 앞을 향하게 합니다.',
                '팔꿈치를 옆구리에 단단히 고정하고 이두근의 힘으로 덤벨을 들어 올립니다.',
                '정점에서 수축을 느낀 후 서서히 저항을 느끼며 덤벨을 내립니다.'
            ]
        },
        '케이블 푸시 다운': {
            name: '케이블 푸시 다운 (Cable Push Down)',
            exerciseId: '0200',
            bodyPart: '팔',
            target: '상완삼두근',
            equipment: '케이블',
            instructions: [
                '케이블 머신 로프를 잡고 상체를 약간 숙여 팔꿈치를 옆구리에 고정합니다.',
                '아래로 강하게 펴주며 삼두근을 수축합니다.'
            ]
        },
        '레그 익스텐션': {
            name: '레그 익스텐션 (Leg Extension)',
            exerciseId: '0584',
            bodyPart: '하체',
            target: '대퇴사두근',
            equipment: '머신',
            instructions: [
                '머신에 앉아 발목 패드를 걸치고 무릎을 펴 허벅지를 수축합니다.'
            ]
        },
        '레그 프레스': {
            name: '레그 프레스 (Leg Press)',
            exerciseId: '0585',
            bodyPart: '하체',
            target: '대퇴사두근/둔근',
            equipment: '머신',
            instructions: [
                '발판에 발을 대고 무릎을 굽혔다가 뒤꿈치 힘으로 밀어냅니다.'
            ]
        },
        '레그 컬': {
            name: '레그 컬 (Leg Curl)',
            exerciseId: '0586',
            bodyPart: '하체',
            target: '대퇴이두근 (햄스트링)',
            equipment: '머신',
            instructions: [
                '누워 발목 패드를 걸치고 무릎을 굽혀 햄스트링을 수축합니다.'
            ]
        },
        '바벨 루마니안 데드리프트': {
            name: '바벨 루마니안 데드리프트 (Barbell Romanian Deadlift)',
            exerciseId: '0032',
            bodyPart: '등/하체',
            target: '척추기립근/햄스트링',
            equipment: '바벨',
            instructions: [
                '바벨을 들고 고관절을 접어 엉덩이를 뒤로 빼며 바를 무릎 아래까지 내립니다.'
            ]
        },
        '바벨 벤치프레스': {
            name: '바벨 벤치프레스 (Barbell Bench Press)',
            exerciseId: '0025',
            bodyPart: '가슴',
            target: '대흉근',
            equipment: '바벨',
            instructions: [
                '벤치에 누워 바벨을 내렸다가 수직 위로 밀어 올립니다.'
            ]
        },
        '딥스': {
            name: '딥스 (Dips)',
            exerciseId: '0208',
            bodyPart: '가슴/삼두',
            target: '하부 대흉근',
            equipment: '맨몸',
            instructions: [
                '평행봉에서 상체를 약간 숙여 내렸다가 밀어 올립니다.'
            ]
        },
        '티바로우': {
            name: '티바로우 (T-Bar Row)',
            exerciseId: '0803',
            bodyPart: '등',
            target: '등 상부',
            equipment: '머신',
            instructions: [
                '지지대 손잡이를 잡고 상체를 숙인 뒤 배꼽 방향으로 당겨 올립니다.'
            ]
        },
        '원암덤벨로우': {
            name: '원암덤벨로우 (One Arm Dumbbell Row)',
            exerciseId: '0292',
            bodyPart: '등',
            target: '광배근',
            equipment: '덤벨',
            instructions: [
                '한 손으로 덤벨을 들고 상체를 숙여 옆구리 방향으로 끌어 올립니다.'
            ]
        },
        '암풀다운': {
            name: '암풀다운 (Straight Arm Pulldown)',
            exerciseId: '0193',
            bodyPart: '등',
            target: '광배근',
            equipment: '케이블',
            instructions: [
                '팔을 편 채로 케이블 바를 골반 방향으로 아치를 그리며 내립니다.'
            ]
        },
        '덤벨 리어 델트 플라이': {
            name: '덤벨 리어 델트 플라이 (Dumbbell Rear Delt Fly)',
            exerciseId: '0380',
            bodyPart: '어깨',
            target: '후면 삼각근',
            equipment: '덤벨',
            instructions: [
                '상체를 숙이고 덤벨을 양옆으로 들어 올려 후면 삼각근을 수축합니다.'
            ]
        },
        '리버스 펙덱플라이': {
            name: '리버스 펙덱플라이 (Reverse Pec Deck Fly)',
            exerciseId: '0592',
            bodyPart: '어깨',
            target: '후면 삼각근',
            equipment: '머신',
            instructions: [
                '거꾸로 머신에 앉아 패드를 양옆 뒤로 밀어내 후면 삼각근을 수축합니다.'
            ]
        },
        '케이블 컬': {
            name: '케이블 컬 (Behind-the-Back Cable Curl) - 장두 타겟',
            exerciseId: '0218',
            bodyPart: '팔',
            target: '상완이두근 장두',
            equipment: '케이블',
            instructions: [
                '케이블 머신 손잡이를 등 뒤로 쥔 채 한 걸음 앞으로 나와 팔을 뒤로 보냅니다.',
                '이두의 장두 긴장을 유지하면서 앞으로 감아 올려 수축합니다.'
            ]
        },
        '라잉 트라이셉스 익스텐션': {
            name: '라잉 트라이셉스 익스텐션 (Lying Triceps Extension)',
            exerciseId: '0063',
            bodyPart: '팔',
            target: '상완삼두근',
            equipment: '바벨/이지바',
            instructions: [
                '벤치에 누워 이마나 정수리 뒤 방향으로 바를 내렸다가 밀어 올립니다.'
            ]
        },
        '핵스쿼트': {
            name: '핵스쿼트 (Hack Squat)',
            exerciseId: '0738',
            bodyPart: '하체',
            target: '대퇴사두근',
            equipment: '머신',
            instructions: [
                '핵스쿼트 머신에 어깨를 대고 쪼그려 앉았다가 뒤꿈치로 밀어 일어섭니다.'
            ]
        },
        '이너타이': {
            name: '이너타이 (Inner Thigh / Adductor)',
            exerciseId: '0589',
            bodyPart: '하체',
            target: '내전근',
            equipment: '머신',
            instructions: [
                '이너타이 머신에 앉아 무릎 패드 안쪽에 허벅지를 위치시킵니다.',
                '허벅지 안쪽(내전근)의 힘으로 패드를 안으로 끝까지 모아 줍니다.',
                '긴장을 서서히 늦추며 천천히 시작 자세로 돌아갑니다.'
            ]
        }
    };

    // 2. 등급별(헬린이/중고급자) 추천 알고리즘 로직 및 루틴 설계

    // 루틴 결과를 운동일지에 바로 추가하는 핸들러 (한글 깨짐 해결 완료)
    window.addRoutineDayToLog = function(dayIndex, dayName, exercisesJsonBase64) {
        try {
            // 한글 깨짐 원인 차단: 디코딩 시 decodeURIComponent(escape(atob(...))) 사용
            const exercises = JSON.parse(decodeURIComponent(escape(atob(exercisesJsonBase64))));
            const logDateInput = document.getElementById('log-date');
            const targetDate = logDateInput ? logDateInput.value : new Date().toISOString().split('T')[0];

            let workoutLogs = JSON.parse(localStorage.getItem('workout_logs')) || [];
            
            // 각 운동을 오늘 날짜의 일지에 추가
            exercises.forEach(exName => {
                // 1. exerciseDatabase에서 우선 조회
                let ex = exerciseDatabase[exName];
                // 2. 없는 경우 globalExercisePool에서 한국어 매칭 탐색
                if (!ex) {
                    ex = globalExercisePool.find(item => item.nameKr && item.nameKr.toLowerCase() === exName.toLowerCase());
                }
                
                const exerciseId = ex ? ex.exerciseId : `custom_${Date.now()}`;
                
                // 중복 등록 방지
                const isAlreadyAdded = workoutLogs.some(log => log.date === targetDate && log.korName === exName);
                if (!isAlreadyAdded) {
                    workoutLogs.push({
                        id: Date.now() + Math.random(),
                        date: targetDate,
                        korName: exName,
                        exerciseId: exerciseId,
                        sets: [
                            { setId: 1, weight: 40, reps: 10 }
                        ]
                    });
                }
            });

            localStorage.setItem('workout_logs', JSON.stringify(workoutLogs));
            
            // 일지 타임라인 화면 리렌더링
            if (typeof renderLogsTimeline === 'function') {
                renderLogsTimeline();
            }

            alert(`'${dayName}' 루틴의 운동 ${exercises.length}개가 ${targetDate} 일지에 등록되었습니다! '📝 운동일지' 탭에서 확인해 보세요.`);
        } catch (e) {
            console.error("루틴 운동일지 추가 실패", e);
            alert("일지 추가에 실패했습니다. 다시 시도해 주세요.");
        }
    };

    // 헬른(고급자)용 다중 루틴 옵션 정의
    const advancedRoutines = {
        4: [
            { id: 0, label: "4분할 (가슴, 등, 어깨, 하체)", hasWeakness: false, days: ['가슴', '등', '어깨', '하체'] },
            { id: 1, label: "밀기 / 당기기 / 하체 / 본인의 약점 부위", hasWeakness: true, days: ['밀기', '당기기', '하체', '약점'] }
        ],
        5: [
            { id: 0, label: "5분할 (가슴, 등, 어깨, 하체, 팔)", hasWeakness: false, days: ['가슴', '등', '어깨', '하체', '팔'] },
            { id: 1, label: "밀기 / 당기기 / 하체 / 밀기 / 당기기 (무한 3분할 순환)", hasWeakness: false, days: ['밀기', '당기기', '하체', '밀기', '당기기'] }
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

            const exercisesForDay = getExercisesForDay(dayRoutine, index);
            // 한글 인코딩 시 btoa(unescape(encodeURIComponent(...)))를 안전하게 사용하여 넘김
            const exercisesJsonBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(exercisesForDay))));

            // 백슬래시 중첩 리터럴 문제 완벽 제거
            const listItemsHtml = exercisesForDay.map(exName => {
                // 1. exerciseDatabase에서 우선 조회
                const ex = exerciseDatabase[exName] || globalExercisePool.find(x => x.nameKr && x.nameKr.toLowerCase() === exName.toLowerCase());
                const displayName = ex ? (ex.nameKr || ex.name) : exName;
                const bodyPartName = ex ? (ex.category || ex.bodyPart) : '전신';
                
                const setInfo = (state.level === 'beginner') ? '4세트' : '2~3세트';
                return `
                    <li onclick="openExerciseDetailModalByName('${exName}')" style="cursor:pointer;">
                        <span class="exercise-name-text">${displayName}</span>
                        <div class="exercise-meta-info">
                            <span class="set-badge">${setInfo}</span>
                            <span class="detail-part">${bodyPartName} ➜</span>
                        </div>
                    </li>
                `;
            }).join('');

            card.innerHTML = `
                <div class="day-badge">DAY ${index + 1}</div>
                <h4>${icon} ${dayRoutine}</h4>
                <ul class="routine-details" id="details-day-${index}">
                    ${listItemsHtml}
                </ul>
                <button class="btn-add-day-to-log" onclick="addRoutineDayToLog(${index + 1}, '${dayRoutine}', '${exercisesJsonBase64}')" style="width: 100%; margin-top: 15px; background: rgba(0, 102, 255, 0.15); border: 1px solid var(--accent); color: #fff; border-radius: 6px; padding: 8px; font-size: 0.8rem; font-weight: bold; cursor: pointer; transition: all 0.2s;">📅 이 날의 운동을 오늘 일지에 등록</button>
            `;
            routineCardsContainer.appendChild(card);
        });
    }

    // 모달 호출 전역 헬퍼 (실제 exercises_db.json 데이터와 100% 매칭)
    window.openExerciseDetailModalByName = function(exName) {
        // 1. exerciseDatabase에서 우선 조회
        let ex = exerciseDatabase[exName];
        // 2. 없는 경우 globalExercisePool에서 한국어 매칭 탐색
        if (!ex) {
            ex = globalExercisePool.find(item => item.nameKr && item.nameKr.toLowerCase() === exName.toLowerCase());
        }
        if (ex && typeof openExerciseDetailModal === 'function') {
            openExerciseDetailModal(ex);
        }
    };

    // 정적 모달 오픈 정의 (무한루프 에러 수정)
    function openExerciseDetailModal(ex) {
        detailName.textContent = ex.nameKr || ex.name;
        
        detailGif.classList.add('hidden');
        gifLoader.classList.remove('hidden');
        
        // 무한루프 원천 차단: onerror 실행 시 핸들러를 null로 초기화
        detailGif.onerror = () => {
            detailGif.onerror = null;
            detailGif.src = 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/0088-1ZFqTDN.jpg';
            gifLoader.classList.add('hidden');
            detailGif.classList.remove('hidden');
        };

        // CDN에서 직접 운동 동작 GIF 로드
        if (ex.exerciseId) {
            detailGif.src = `https://static.exercisedb.dev/media/${ex.exerciseId}.gif`;
            detailGif.onload = () => {
                gifLoader.classList.add('hidden');
                detailGif.classList.remove('hidden');
            };
        } else {
            // 영상이 비어있는 경우 (장두 타겟 케이블 컬 등)
            detailGif.src = '';
            detailGif.classList.add('hidden');
            gifLoader.classList.add('hidden');
        }

        detailBodyPart.textContent = ex.category || ex.bodyPart;
        detailTarget.textContent = ex.target || '전신';
        detailEquipment.textContent = ex.equipment || '기구';

        detailInstructions.innerHTML = '';
        const instructions = ex.instructions || [];
        instructions.forEach(step => {
            const li = document.createElement('li');
            li.textContent = step;
            detailInstructions.appendChild(li);
        });

        modalDetail.classList.remove('hidden');
    }

    // 상세 모달 닫기 버튼 이벤트 바인딩
    if (btnCloseDetailModal) {
        btnCloseDetailModal.addEventListener('click', () => {
            modalDetail.classList.add('hidden');
        });
    }

    // 모달 외부 영역 클릭 시 닫기
    window.addEventListener('click', (e) => {
        if (e.target === modalDetail) {
            modalDetail.classList.add('hidden');
        }
    });

    // 요일별/구력별/일수별 디테일 운동 매핑
    function getExercisesForDay(dayRoutine, cardIndex) {
        let selectedExercises = [];
        const level = state.level;
        const days = state.days;

        // 전체적으로 모든 "하체" 루틴은 고정된 구성으로 처리 (사용자 피드백 수렴)
        if (dayRoutine === '하체') {
            return ['이너타이', '레그 익스텐션', '레그 컬', '핵스쿼트', '바벨 루마니안 데드리프트', '레그 프레스'];
        }

        if (level === 'beginner') {
            // ==========================================
            // 1. 헬린이 (초급자) 맞춤 루틴
            // ==========================================
            if (dayRoutine === '상체') {
                if (cardIndex === 0) {
                    selectedExercises = [
                        '플라이 머신', '로우 인클라인 덤벨 프레스', 
                        '렛풀다운', '롱풀', 
                        '덤벨 숄더 프레스', '덤벨 사이드 레터럴 레이즈', 
                        '덤벨 컬', '케이블 푸시 다운'
                    ];
                } else {
                    selectedExercises = [
                        '렛풀다운', '롱풀', 
                        '덤벨 숄더 프레스', '덤벨 사이드 레터럴 레이즈', 
                        '플라이 머신', '로우 인클라인 덤벨 프레스', 
                        '케이블 푸시 다운', '덤벨 컬'
                    ];
                }
            } 
            else if (dayRoutine === '전면') {
                const upper = ['플라이 머신', '로우 인클라인 덤벨 프레스', '덤벨 숄더 프레스', '덤벨 사이드 레터럴 레이즈', '케이블 푸시 다운'];
                const lower = ['레그 익스텐션', '레그 프레스'];
                
                if (cardIndex === 0) {
                    selectedExercises = [...upper, ...lower];
                } else {
                    selectedExercises = [...lower, ...upper];
                }
            } 
            else if (dayRoutine === '후면') {
                const upper = ['렛풀다운', '롱풀', '원암덤벨로우', '덤벨 컬'];
                const lower = ['레그 컬', '바벨 루마니안 데드리프트'];
                
                if (cardIndex === 1) {
                    selectedExercises = [...upper, ...lower];
                } else {
                    selectedExercises = [...lower, ...upper];
                }
            } 
            else if (dayRoutine === '밀기') {
                selectedExercises = [
                    '플라이 머신', 
                    '로우 인클라인 덤벨 프레스', 
                    '어시스트 딥스', 
                    '덤벨 숄더 프레스', 
                    '덤벨 사이드 레터럴 레이즈', 
                    '케이블 푸시 다운'
                ];
            } 
            else if (dayRoutine === '당기기') {
                selectedExercises = [
                    '렛풀다운', 
                    '티바로우', 
                    '원암덤벨로우', 
                    '롱풀', 
                    '어시스트 풀업', 
                    '덤벨 컬'
                ];
            }
        } 
        else if (level === 'intermediate' || level === 'advanced') {
            // ==========================================
            // 2. 헬소년(중급자) 및 헬른(고급자) 맞춤 루틴
            // ==========================================
            if (dayRoutine === '상체') {
                const chest = cardIndex === 0
                    ? ['바벨 벤치프레스', '인클라인 덤벨 프레스', '딥스']
                    : ['바벨 벤치프레스', '인클라인 덤벨 프레스', '플라이 머신'];
                    
                const back = cardIndex === 0
                    ? ['렛풀다운', '롱풀', '원암덤벨로우']
                    : ['렛풀다운', '티바로우', '원암덤벨로우'];
                    
                const shoulders = cardIndex === 0
                    ? ['덤벨 숄더 프레스', '덤벨 사이드 레터럴 레이즈']
                    : ['덤벨 사이드 레터럴 레이즈', '덤벨 숄더 프레스'];
                    
                const biceps = cardIndex === 0
                    ? ['덤벨 컬', '케이블 컬']
                    : ['케이블 컬', '덤벨 컬'];
                    
                const triceps = cardIndex === 0
                    ? ['라잉 트라이셉스 익스텐션', '케이블 푸시 다운']
                    : ['케이블 푸시 다운', '라잉 트라이셉스 익스텐션'];

                selectedExercises = [...chest, ...back, ...shoulders, ...biceps, ...triceps];
            } 
            else if (dayRoutine === '전면') {
                const chest = cardIndex === 0 
                    ? ['바벨 벤치프레스', '인클라인 덤벨 프레스', '딥스']
                    : ['바벨 벤치프레스', '인클라인 덤벨 프레스', '플라이 머신'];
                    
                const shoulders = cardIndex === 0
                    ? ['덤벨 숄더 프레스', '덤벨 사이드 레터럴 레이즈']
                    : ['덤벨 사이드 레터럴 레이즈', '덤벨 숄더 프레스'];
                    
                const triceps = cardIndex === 0
                    ? ['라잉 트라이셉스 익스텐션', '케이블 푸시 다운']
                    : ['케이블 푸시 다운', '라잉 트라이셉스 익스텐션'];
                    
                const lower = cardIndex === 0
                    ? ['레그 익스텐션', '핵스쿼트']
                    : ['레그 익스텐션', '레그 프레스'];
                    
                const upper = [...chest, ...shoulders, ...triceps];
                
                if (cardIndex === 0) {
                    selectedExercises = [...upper, ...lower];
                } else {
                    selectedExercises = [...lower, ...upper];
                }
            } 
            else if (dayRoutine === '후면') {
                const back = ['암풀다운', '티바로우', '렛풀다운', '롱풀', '원암덤벨로우'];
                const hams = ['레그 컬', '바벨 루마니안 데드리프트'];
                
                const biceps = cardIndex === 1 
                    ? ['덤벨 컬', '케이블 컬'] 
                    : ['케이블 컬', '덤벨 컬'];
                    
                const rearDelt = cardIndex === 1
                    ? ['덤벨 리어 델트 플라이']
                    : ['리버스 펙덱플라이'];

                if (cardIndex === 1) {
                    selectedExercises = [...back, ...hams, ...rearDelt, ...biceps];
                } else {
                    selectedExercises = [...hams, ...back, ...biceps, ...rearDelt];
                }
            } 
            else if (dayRoutine === '밀기') {
                selectedExercises = [
                    '바벨 벤치프레스', 
                    '인클라인 덤벨 프레스', 
                    '로우 인클라인 덤벨 프레스', 
                    '어시스트 딥스', 
                    '덤벨 숄더 프레스', 
                    '덤벨 사이드 레터럴 레이즈', 
                    '라잉 트라이셉스 익스텐션', 
                    '케이블 푸시 다운'
                ];
            } 
            else if (dayRoutine === '당기기') {
                // 등 루틴: 암풀다운, 티바로우, 렛풀다운, 롱풀, 원암덤벨로우
                const back = ['암풀다운', '티바로우', '렛풀다운', '롱풀', '원암덤벨로우'];
                const biceps = cardIndex % 2 === 1 ? ['덤벨 컬', '케이블 컬'] : ['케이블 컬', '덤벨 컬'];
                const rearDelt = cardIndex % 2 === 1 ? ['덤벨 리어 델트 플라이'] : ['리버스 펙덱플라이'];
                
                // 후면어깨랑 이두 자체의 순서 로테이션 (cardIndex 홀짝에 따름)
                if (cardIndex % 2 === 1) {
                    selectedExercises = [...back, ...biceps, ...rearDelt];
                } else {
                    selectedExercises = [...back, ...rearDelt, ...biceps];
                }
            } 
            else if (dayRoutine === '가슴') {
                // 가슴 루틴은 사레레 추가
                selectedExercises = ['바벨 벤치프레스', '인클라인 덤벨 프레스', '플라이 머신', '어시스트 딥스', '딥스', '덤벨 사이드 레터럴 레이즈'];
            } 
            else if (dayRoutine === '등') {
                // 등 루틴은 이두 추가
                selectedExercises = ['암풀다운', '티바로우', '렛풀다운', '롱풀', '원암덤벨로우', '덤벨 컬'];
            } 
            else if (dayRoutine === '어깨') {
                // 어깨 루틴은 삼두 추가
                selectedExercises = ['덤벨 숄더 프레스', '덤벨 사이드 레터럴 레이즈', '덤벨 리어 델트 플라이', '리버스 펙덱플라이', '케이블 푸시 다운'];
            } 
            else if (dayRoutine === '팔') {
                selectedExercises = ['덤벨 컬', '케이블 컬', '라잉 트라이셉스 익스텐션', '케이블 푸시 다운'];
            } 
            else if (dayRoutine.startsWith('약점 부위')) {
                selectedExercises = ['바벨 벤치프레스', '렛풀다운', '롱pull', '덤벨 숄더 프레스'];
            }
        }

        return Array.from(new Set(selectedExercises)).map(x => x === '롱pull' ? '롱풀' : x).filter(Boolean);
    }\n\n// 운동일지 (Workout Log) 기능 개발 로직
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
