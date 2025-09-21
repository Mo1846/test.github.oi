// 测试题目数据（可根据需求修改）
const questions = [
    {
        question: "在基金产品路演前夜，风控部门临时提出合同条款修改意见，可能影响销售部门的客户承诺。你会：",
        options: [
            { text: "仅向领导反馈问题，等待决策", score: 1 },
            { text: "连夜修订合同模板并附风险评估报告，同步更新路演材料", score: 2 },
            { text: "直接告知销售团队无法调整", score: 0 },
            { text: "协调风控与销售部门召开紧急会议，提出折中方案", score: 3 }
        ]
    },
    {
        question: "监控系统提示某债券基金持仓中出现异常交易数据（疑似利益输送），但基金经理认为是正常调仓。你会：",
        options: [
            { text: "认为是系统误报，忽略提醒", score: 0 },
            { text: "向合规部门发送邮件备案", score: 1 },
            { text: "调取交易流水交叉验证并撰写风险提示函", score: 2 },
            { text: "立即申请冻结账户并联合审计部门启动专项调查", score: 3 }
        ]
    },
    {
        question: "客户要求对比新能源主题基金与大盘指数的超额收益，但现有系统无法直接生成图表。你会：",
        options: [
            { text: "手工导出数据用Excel制表", score: 1 },
            { text: "请求IT部门开发专用报表", score: 0 },
            { text: "调用Wind API并考虑制作可复用的动态交互式仪表盘", score: 3 },
            { text: "使用Python编写爬虫抓取数据并可视化", score: 2 }
        ]
    },
    {
        question: "高净值客户投诉某养老FOF基金波动过大，但产品设计符合监管要求。你会：",
        options: [
            { text: "引用法规条文解释风险", score: 0 },
            { text: "承诺降低产品风险等级", score: 1 },
            { text: "分析客户资产配置比例并提供替代方案", score: 2 },
            { text: "建立客户风险偏好数据库，反向定制基金组合", score: 3 }
        ]
    },
    {
        question: "午盘时段突发政策利空，股指期货闪崩5%，交易所系统延迟频发，客户电话涌入投诉，此时：",
        options: [
            { text: "试图与客户争论，声明责任归属，面对情绪失控的客户不予理睬", score: 0 },
            { text: "试图查找过往类似危机应对案例，照例处理，并让同事安抚客户", score: 1 },
            { text: "召开部门紧急会议，依照应急预案分批次挂起散户赎回，同步向高管同步实时风险敞口数据", score: 3 },
            { text: "直接启用备用交易通道，并联系IT部门排查系统延迟原因", score: 2 }
        ]
    },
    {
        question: "观察到近期同业存单指数基金规模暴增，你会：",
        options: [
            { text: "分析资金流向与货币政策关联性", score: 2 },
            { text: "构建久期匹配模型预判市场拐点", score: 3 },
            { text: "推荐客户跟进潮流申购", score: 1 },
            { text: "认为是短期热点，不予关注", score: 0 }
        ]
    }
];

// 全局变
let currentPage = 0; // 当前页面索引（0:简介页，1-6:题目页，7:结果页）
let userAnswers = []; // 存储用户答案（分数）
const pagesContainer = document.querySelector('.pages-container');
const questionsContainer = document.querySelector('.questions-container');

// 初始化题目页
function initQuestions() {
    questions.forEach((q, index) => {
        const questionPage = document.createElement('div');
        questionPage.className = `page question-page`;
        questionPage.dataset.index = index + 1; // 题目页索引1-5
        
        const title = document.createElement('h2');
        title.className = 'question-title';
        title.textContent = `${q.question}`;
        questionPage.appendChild(title); // 将题干添加到题目页
        
        q.options.forEach((option, optIndex) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = option.text;
            btn.dataset.score = option.score;
            btn.addEventListener('click', () => selectOption(btn, index));
            questionPage.appendChild(btn);
        });

        const btnContainer = document.createElement('div');
        btnContainer.className = 'btn-container';
        
        const prevBtn = document.createElement('button');
        prevBtn.className = 'btn prev-btn';
        prevBtn.textContent = '上一题';
        prevBtn.disabled = index === 0; // 第一题禁用上一题
        prevBtn.addEventListener('click', goToPrevPage);
        btnContainer.appendChild(prevBtn);       
        
        const nextBtn = document.createElement('button');
        nextBtn.className = 'btn next-btn';
        nextBtn.textContent = index === questions.length - 1 ? '查看结果' : '下一题';
        nextBtn.addEventListener('click', goToNextPage);
        btnContainer.appendChild(nextBtn);        

        questionPage.appendChild(btnContainer); // 将按钮容器添加到题目页
        questionsContainer.appendChild(questionPage); // 将题目页添加到容器
    });
}

// 选择选项
function selectOption(btn, qIndex) {
    // 移除同题其他选项的选中状态
    const currentOptions = document.querySelectorAll(`.question-page[data-index="${qIndex + 1}"] .option-btn`);
    currentOptions.forEach(opt => opt.classList.remove('selected'));
    
    // 标记当前选中项
    btn.classList.add('selected');
    btn.disabled = true; // 禁用已选选项
    
    // 存储分数（qIndex从0开始，对应userAnswers索引）
    userAnswers[qIndex] = parseInt(btn.dataset.score);
    
    // 启用下一题按钮
    const nextBtn = document.querySelector(`.question-page[data-index="${qIndex + 1}"] .next-btn`);
    nextBtn.disabled = false;
}

// 切换页面
function switchPage(targetPage) {
    // 调试：打印当前激活页，确认切换逻辑
    console.log('当前激活页:', document.querySelector('.page.active'));
    
    // 移除当前激活页的 active 类
    document.querySelector('.page.active').classList.remove('active');
    
    if (targetPage === 'intro') {
        document.querySelector('.intro-page').classList.add('active');
        currentPage = 0;
    } else if (targetPage === 'result') {
        showResult();
        document.querySelector('.result-page').classList.add('active');
        currentPage = 7;
    } else {
        // 激活题目页（data-index 对应 1-5）
        const questionPage = document.querySelector(`.question-page[data-index="${targetPage}"]`);
        questionPage.classList.add('active');
        currentPage = parseInt(targetPage);
        
        // 更新上一题按钮状态
        const prevBtn = questionPage.querySelector('.prev-btn');
        prevBtn.disabled = currentPage === 1;
    }
}

// 上一题
function goToPrevPage() {
    if (currentPage > 1) {
        switchPage(currentPage - 1);
    }
}

// 下一题/查看结果
function goToNextPage() {
    if (currentPage < 6) {
        // 检查当前题是否已答
        const currentQIndex = currentPage - 1;
        if (userAnswers[currentQIndex] === undefined) {
            alert('请选择当前题的答案');
            return;
        }
        switchPage(currentPage + 1);
    } else {
        // 显示结果页
        switchPage('result');
    }
}

function calculateTotalScore(weights, answers) {
    return weights.reduce((sum, weight, index) => sum + weight * answers[index], 0);
}

// 计算并显示结果
function showResult() {
    const lineWeights = {
        "投资研究条线": [4, 2, 3, 3, 2, 6],
        "运作管理条线": [5, 3, 2, 3, 5, 2],
        "产品研发及绩效评价条线": [3, 2, 3, 5, 3, 5],
        "风险合规管理条线": [3, 7, 2, 2, 3, 3],
        "IT及金融科技条线": [2, 4, 7, 2, 3, 2]
    };    

    const funnyNames = {
        "投资研究条线": "投资洞察冒险家",
        "运作管理条线": "运作流程护航员",
        "产品研发及绩效评价条线": "产品创绩魔法师",
        "风险合规管理条线": "风险合规守门员",
        "IT及金融科技条线": "金融科技建筑师"
    };    

    const introductions = {
        "投资研究条线": `你像“市场侦察兵”，总从宏观、行业里挖投资线索，爱和研究员聊专业梗，为“行业逻辑是否成立”反复推敲。常问“这只基金投什么？”
                            “行业景气度咋变？”<br>你的战场是<strong><span style = "color:#6593c2">“投资研究条线”</span></strong>。`,
        "运作管理条线": `你或许是“隐形协调者”，擅长在销售、投资、托管间“穿针引线”，听懂客户急需求，推动后台高效落地。遇发行、登记堵点就救火，
                            更享受“基金顺利运作”的踏实感。常说“我来跟进”“这样更顺”<br>你的舞台是<strong><span style = "color:#6593c2">“运作管理条线”</span></strong>。`,
        "产品研发及绩效评价条线": `你或许是“产品设计师”，把客户模糊需求变成具体基金，用数据证明策略能跑赢。不追求技术大神，但对“投资者需求”有执念，
                            热爱“从0到1设计新品”，常为“风险收益比能不能更优”头脑风暴。常想“投资者要啥基金？”<br>你的天地是<strong><span style = "color:#6593c2">“产品研发及绩效评价条线”</span></strong>。`,
        "风险合规管理条线": `你或许是“风险预警者”，敏锐嗅出投资组合漏洞，用合规视角审决策。不踩红线但敢于挑战，比起执行更爱“用风控护投资者”，
                            常说“这标的有风险，调仓位”。常问“合规吗？”“极端风险预案？”<br>你的角色是<strong><span style = "color:#6593c2">“风险合规管理条线”</span></strong>。`,
        "IT及金融科技条线": `你或许是“技术实干派”，用代码/模型简化基金运营，爱“技术方案落地”的成就感。社交属性不详但是熟知科技趋势，享受“用系统支持投资决策”，
                            常为“系统效率能不能提升”熬夜调试。常想“技术咋优化流程？”<br>你的舞台是<strong><span style = "color:#6593c2">“IT及金融科技条线”</span><strong>。`
    };

    const linepicture = {
        "投资研究条线": "./pic/投资洞察冒险家.jpg",
        "运作管理条线": "./pic/运作流程护航员.jpg",
        "产品研发及绩效评价条线": "./pic/产品创绩魔法师.jpg",
        "风险合规管理条线": "./pic/风险合规守门员.jpg",
        "IT及金融科技条线": "./pic/金融科技建筑师.jpg"
    };    
    const userScores = [...userAnswers]; // 复制用户得分数组

    const matchScores = {};
    for (const [line, weights] of Object.entries(lineWeights)) {
        matchScores[line] = calculateTotalScore(weights,userScores)}

    const sortedScore = Object.entries(matchScores).sort((a,b) => b[1]-a[1]);

    const topLineName = sortedScore[0]?.[0]; 

    const topFunnyName = topLineName ? funnyNames[topLineName] : "未知条线，你的能力很特别";

    const lineintro = topLineName ? introductions[topLineName] : "你的能力很特别，适合多种条线的工作";

    const lineimg = topLineName ? linepicture[topLineName] : "./pic/default.JPG";

    document.getElementById('recommandation').textContent = topFunnyName;
    
    // 根据总分生成结果描述（可自定义）
    document.getElementById('result-desc').innerHTML = lineintro;
    
    // 更新结果图片
    const resultImage = document.querySelector('.result-image');
    resultImage.src = lineimg;
    resultImage.alt = topFunnyName;
}

// 重新测试
function restartTest() {
    userAnswers = [];
    // 清空题目页选中状态
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('selected');
        btn.disabled = false;
    });
    // 重置下一题按钮状态
    document.querySelectorAll('.next-btn').forEach(btn => btn.disabled = true);
    switchPage('intro');
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initQuestions();
    
    // 绑定开始测试按钮
    document.querySelector('.start-btn').addEventListener('click', () => switchPage(1));
    
    // 绑定重新测试按钮
    document.querySelector('.restart-btn').addEventListener('click', restartTest);
});