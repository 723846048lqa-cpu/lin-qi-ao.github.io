// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化滚动动画
    initScrollAnimations();
    
    // 初始化技能标签云交互
    initSkillCloud();
    
    // 初始化PDF导出功能
    initPdfExport();
    
    // 初始化二维码生成功能
    initQrCode();
    
    // 初始化ATS优化功能
    initAtsOptimize();
    
    // 初始化模态框
    initModals();
});

// 滚动动画初始化
function initScrollAnimations() {
    const sections = document.querySelectorAll('.section');
    
    // 观察器配置
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    // 创建观察器
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // 观察所有section元素
    sections.forEach(section => {
        observer.observe(section);
    });
}

// 技能标签云交互初始化
function initSkillCloud() {
    const skillTags = document.querySelectorAll('.skill-tag');
    
    skillTags.forEach(tag => {
        tag.addEventListener('click', function() {
            // 移除其他标签的active状态
            skillTags.forEach(t => t.classList.remove('active'));
            // 添加当前标签的active状态
            this.classList.add('active');
            
            // 显示熟练度信息
            const proficiency = this.getAttribute('data-proficiency');
            console.log(`技能: ${this.textContent}, 熟练度: ${proficiency}%`);
        });
        
        // 添加悬停效果的增强
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        tag.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
    });
}

// PDF导出功能初始化
function initPdfExport() {
    const exportBtn = document.getElementById('export-pdf');
    
    exportBtn.addEventListener('click', function() {
        // 配置pdf选项
        const opt = {
            margin: 10,
            filename: '个人名片.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        
        // 选择要导出的内容
        const element = document.querySelector('main');
        
        // 导出PDF
        html2pdf().set(opt).from(element).save();
    });
}

// 二维码生成功能初始化
function initQrCode() {
    const generateBtn = document.getElementById('generate-qr');
    const qrModal = document.getElementById('qr-modal');
    const qrcodeDiv = document.getElementById('qrcode');
    
    generateBtn.addEventListener('click', function() {
        // 清空之前的二维码
        qrcodeDiv.innerHTML = '';
        
        // 获取当前页面URL
        const url = window.location.href;
        
        // 生成二维码
        new QRCode(qrcodeDiv, {
            text: url,
            width: 200,
            height: 200,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
        
        // 显示模态框
        qrModal.style.display = 'block';
    });
}

// ATS优化功能初始化
function initAtsOptimize() {
    const atsBtn = document.getElementById('ats-optimize');
    const jdText = document.getElementById('jd-text');
    const matchResult = document.getElementById('match-result');
    const applyAtsBtn = document.getElementById('apply-ats');
    
    // 监听JD文本输入变化
    jdText.addEventListener('input', function() {
        analyzeJD(this.value);
    });
    
    // 应用优化按钮点击事件
    applyAtsBtn.addEventListener('click', function() {
        alert('ATS优化已应用！建议根据匹配结果调整简历内容，突出匹配度高的关键词。');
    });
    
    // 分析JD内容
    function analyzeJD(jdContent) {
        if (!jdContent.trim()) {
            matchResult.innerHTML = '<p>请粘贴目标岗位的JD内容...</p>';
            return;
        }
        
        // 提取简历中的关键词
        const resumeKeywords = extractResumeKeywords();
        
        // 提取JD中的关键词
        const jdKeywords = extractJDKeywords(jdContent);
        
        // 匹配关键词
        const matchedKeywords = matchKeywords(resumeKeywords, jdKeywords);
        
        // 显示匹配结果
        displayMatchResult(matchedKeywords, jdKeywords);
    }
    
    // 提取简历关键词
    function extractResumeKeywords() {
        // 从技能标签中提取关键词
        const skillTags = document.querySelectorAll('.skill-tag');
        const skills = Array.from(skillTags).map(tag => tag.textContent.toLowerCase());
        
        // 从其他部分提取关键词
        const sections = document.querySelectorAll('.section');
        let textContent = '';
        sections.forEach(section => {
            textContent += section.textContent + ' ';
        });
        
        // 提取职位相关关键词
        const title = document.querySelector('.title').textContent.toLowerCase();
        
        // 合并所有关键词
        const allKeywords = [...skills, title];
        
        // 去重
        return [...new Set(allKeywords)];
    }
    
    // 提取JD关键词
    function extractJDKeywords(jdContent) {
        // 简单的关键词提取，实际应用中可以使用更复杂的NLP算法
        const stopWords = ['的', '了', '是', '在', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这'];
        
        // 转换为小写并去除标点符号
        const cleanedText = jdContent.toLowerCase().replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, ' ');
        
        // 分词并去重
        const words = cleanedText.split(/\s+/).filter(word => word.length > 1 && !stopWords.includes(word));
        
        // 统计词频
        const wordFreq = {};
        words.forEach(word => {
            wordFreq[word] = (wordFreq[word] || 0) + 1;
        });
        
        // 按词频排序，取前50个关键词
        const sortedKeywords = Object.entries(wordFreq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 50)
            .map(entry => entry[0]);
        
        return sortedKeywords;
    }
    
    // 匹配关键词
    function matchKeywords(resumeKeywords, jdKeywords) {
        const matched = [];
        
        resumeKeywords.forEach(resumeKeyword => {
            jdKeywords.forEach(jdKeyword => {
                if (jdKeyword.includes(resumeKeyword) || resumeKeyword.includes(jdKeyword)) {
                    matched.push(resumeKeyword);
                }
            });
        });
        
        // 去重
        return [...new Set(matched)];
    }
    
    // 显示匹配结果
    function displayMatchResult(matchedKeywords, jdKeywords) {
        const matchRate = Math.round((matchedKeywords.length / jdKeywords.length) * 100);
        
        let resultHtml = `
            <div class="match-summary">
                <p><strong>匹配率:</strong> ${matchRate}%</p>
                <p><strong>匹配关键词数量:</strong> ${matchedKeywords.length}/${jdKeywords.length}</p>
            </div>
            <div class="match-keywords">
                <h5>匹配的关键词:</h5>
                <div class="keyword-tags">
        `;
        
        matchedKeywords.forEach(keyword => {
            resultHtml += `<span class="keyword-tag matched">${keyword}</span>`;
        });
        
        resultHtml += `
                </div>
            </div>
        `;
        
        matchResult.innerHTML = resultHtml;
    }
}

// 模态框初始化
function initModals() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close');
    
    // 关闭模态框
    function closeModal(modal) {
        modal.style.display = 'none';
    }
    
    // 点击关闭按钮
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    // 点击模态框外部关闭
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target);
        }
    });
    
    // ESC键关闭模态框
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.style.display === 'block') {
                    closeModal(modal);
                }
            });
        }
    });
}

// 添加ATS优化相关的CSS样式
const style = document.createElement('style');
style.textContent = `
    .match-summary {
        margin-bottom: 1rem;
        padding: 1rem;
        background-color: #e8f4f8;
        border-radius: 4px;
    }
    
    .match-keywords h5 {
        margin-bottom: 0.8rem;
        color: #2c3e50;
    }
    
    .keyword-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
    
    .keyword-tag {
        padding: 0.3rem 0.8rem;
        border-radius: 15px;
        font-size: 0.9rem;
        font-weight: 500;
    }
    
    .keyword-tag.matched {
        background-color: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
    }
    
    .skill-tag.active {
        transform: translateY(-3px) scale(1.05);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
`;
document.head.appendChild(style);

// 添加平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 添加页面加载动画
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});