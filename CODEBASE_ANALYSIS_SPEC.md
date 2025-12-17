# Codebase Analysis Specification for Unicorn Hunter

## Overview

This document specifies the requirements for integrating actual codebase analysis into the Unicorn Hunter valuation system. Currently, the system only analyzes GitHub activity metrics (stars, forks, commits). This spec outlines how to add comprehensive codebase analysis to provide more accurate and meaningful valuations.

## Current State

### What's Currently Analyzed
- GitHub activity metrics (stars, forks, watchers, open issues)
- Development activity (commits, contributors, commit frequency)
- Repository metadata (language, age, description)

### Limitations
- No code quality assessment
- No codebase complexity analysis
- No test coverage evaluation
- No dependency/security analysis
- No architecture evaluation

## Desired State: Codebase Analysis Integration

### 1. Code Quality Metrics

#### 1.1 Code Complexity Analysis
- **Cyclomatic Complexity**: Average and max complexity per function/method
- **Cognitive Complexity**: Measure of code readability
- **Code Duplication**: Percentage of duplicated code blocks
- **File Size Distribution**: Average file size, max file size, distribution
- **Function/Method Length**: Average and max lines per function

**Output Format:**
```json
{
  "code_complexity": {
    "average_cyclomatic_complexity": 5.2,
    "max_cyclomatic_complexity": 45,
    "cognitive_complexity_score": 3.8,
    "duplication_percentage": 12.5,
    "average_file_size": 450,
    "average_function_length": 25
  }
}
```

#### 1.2 Code Quality Scores
- **Maintainability Index**: 0-100 score
- **Technical Debt Ratio**: Estimated hours to fix issues
- **Code Smell Density**: Number of code smells per 1000 lines
- **Documentation Coverage**: Percentage of functions/classes with docstrings

**Output Format:**
```json
{
  "quality_scores": {
    "maintainability_index": 72,
    "technical_debt_ratio": 0.15,
    "code_smell_density": 8.3,
    "documentation_coverage": 65.2
  }
}
```

### 2. Test Coverage Analysis

#### 2.1 Test Metrics
- **Test Coverage Percentage**: Overall code coverage
- **Unit Test Coverage**: Coverage by unit tests
- **Integration Test Coverage**: Coverage by integration tests
- **Test-to-Code Ratio**: Number of test lines per production line
- **Test Quality**: Test complexity and maintainability

**Output Format:**
```json
{
  "test_coverage": {
    "overall_coverage": 78.5,
    "unit_test_coverage": 82.3,
    "integration_test_coverage": 45.2,
    "test_to_code_ratio": 0.65,
    "test_quality_score": 7.2
  }
}
```

### 3. Dependency & Security Analysis

#### 3.1 Dependency Health
- **Dependency Count**: Total number of dependencies
- **Outdated Dependencies**: Count and percentage of outdated packages
- **Security Vulnerabilities**: Count of known CVEs
- **License Compliance**: License compatibility analysis
- **Dependency Freshness**: Average age of dependencies

**Output Format:**
```json
{
  "dependencies": {
    "total_dependencies": 45,
    "outdated_count": 8,
    "outdated_percentage": 17.8,
    "security_vulnerabilities": 2,
    "critical_vulnerabilities": 0,
    "license_compliance_score": 95,
    "average_dependency_age_days": 180
  }
}
```

### 4. Architecture & Design Analysis

#### 4.1 Architecture Metrics
- **Modularity Score**: How well-separated are modules
- **Coupling Score**: Inter-module dependencies (lower is better)
- **Cohesion Score**: How related are functions within modules (higher is better)
- **Design Pattern Usage**: Identification of common patterns
- **Architecture Patterns**: MVC, microservices, monolith detection

**Output Format:**
```json
{
  "architecture": {
    "modularity_score": 7.5,
    "coupling_score": 3.2,
    "cohesion_score": 8.1,
    "design_patterns_detected": ["MVC", "Repository", "Factory"],
    "architecture_type": "modular_monolith"
  }
}
```

### 5. Documentation Analysis

#### 5.1 Documentation Metrics
- **README Quality**: Presence and completeness of README
- **API Documentation**: Presence of API docs (OpenAPI, GraphQL schema, etc.)
- **Code Comments**: Percentage of functions with comments
- **Documentation Freshness**: Last update date of docs vs code

**Output Format:**
```json
{
  "documentation": {
    "readme_quality_score": 8.5,
    "api_documentation_present": true,
    "api_documentation_type": "OpenAPI",
    "comment_coverage": 45.2,
    "documentation_freshness_days": 30
  }
}
```

### 6. Language & Framework Analysis

#### 6.1 Technology Stack
- **Primary Languages**: Distribution of code by language
- **Framework Usage**: Identified frameworks and versions
- **Language Modernity**: Use of modern language features
- **Build System**: Type of build system and configuration quality

**Output Format:**
```json
{
  "technology_stack": {
    "primary_languages": {
      "JavaScript": 65.2,
      "TypeScript": 30.1,
      "CSS": 4.7
    },
    "frameworks": ["React", "Next.js"],
    "language_modernity_score": 8.5,
    "build_system": "webpack"
  }
}
```

## Integration with Existing MCP System

### MCP Tool Specification

#### New Tool: `analyze_codebase`

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "repo_data": {
      "type": "object",
      "description": "Repository data from analyze_github_repository tool"
    },
    "analysis_depth": {
      "type": "string",
      "enum": ["quick", "standard", "deep"],
      "description": "Depth of analysis - quick (5min), standard (15min), deep (30min)",
      "default": "standard"
    },
    "include_metrics": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": ["complexity", "quality", "tests", "dependencies", "architecture", "documentation", "technology"]
      },
      "description": "Which analysis categories to include",
      "default": ["all"]
    }
  },
  "required": ["repo_data"]
}
```

**Output Schema:**
```json
{
  "type": "object",
  "properties": {
    "codebase_analysis": {
      "code_complexity": { /* see section 1.1 */ },
      "quality_scores": { /* see section 1.2 */ },
      "test_coverage": { /* see section 2.1 */ },
      "dependencies": { /* see section 3.1 */ },
      "architecture": { /* see section 4.1 */ },
      "documentation": { /* see section 5.1 */ },
      "technology_stack": { /* see section 6.1 */ }
    },
    "analysis_timestamp": {
      "type": "string",
      "format": "date-time"
    },
    "analysis_duration_seconds": {
      "type": "number"
    }
  }
}
```

### Updated Unicorn Hunter Tool

#### Enhanced `unicorn_hunter` Tool

**Updated Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "repo_data": {
      "type": "object",
      "description": "Repository data from analyze_github_repository"
    },
    "codebase_analysis": {
      "type": "object",
      "description": "Optional codebase analysis from analyze_codebase tool"
    },
    "include_codebase_analysis": {
      "type": "boolean",
      "description": "Whether to include codebase analysis in valuation",
      "default": true
    }
  },
  "required": ["repo_data"]
}
```

**Enhanced Component Scores:**
The existing component scores should be enhanced with codebase metrics:

```json
{
  "component_scores": {
    "community_momentum": 91.2,  // Existing: GitHub activity
    "development_velocity": 62.1,  // Existing: Commit frequency
    "technology_quality": 90.0,  // ENHANCED: Now includes code quality, architecture, dependencies
    "market_potential": 100,  // Existing: Based on stars/forks
    "network_effects": 100,  // Existing: Based on forks/contributors
    "code_quality": 78.5,  // NEW: From codebase analysis
    "maintainability": 72.0,  // NEW: From maintainability index
    "test_reliability": 82.3,  // NEW: From test coverage
    "security_posture": 88.0  // NEW: From dependency security analysis
  }
}
```

## Implementation Requirements

### 1. Code Analysis Tools Integration

#### Recommended Tools (LangChain Compatible)

**For Code Complexity:**
- **Radon** (Python) - Cyclomatic complexity
- **SonarQube** (Multi-language) - Code quality and complexity
- **CodeClimate** (Multi-language) - Maintainability index

**For Test Coverage:**
- **Coverage.py** (Python)
- **Istanbul/nyc** (JavaScript/TypeScript)
- **JaCoCo** (Java)
- **gocov** (Go)

**For Dependencies:**
- **npm audit** (Node.js)
- **pip-audit** (Python)
- **safety** (Python)
- **OWASP Dependency-Check** (Multi-language)

**For Architecture:**
- **jscpd** - Code duplication
- **dependency-cruiser** - Dependency analysis
- **ArchUnit** (Java) - Architecture testing

### 2. LangChain Agent Workflow

#### Suggested Agent Flow

```
1. analyze_github_repository (existing)
   ↓
2. Clone repository to temporary storage
   ↓
3. analyze_codebase (new tool)
   ├─→ Run complexity analysis
   ├─→ Run test coverage analysis
   ├─→ Run dependency security scan
   ├─→ Analyze architecture
   ├─→ Evaluate documentation
   └─→ Aggregate results
   ↓
4. unicorn_hunter (enhanced)
   ├─→ Combine GitHub metrics
   ├─→ Combine codebase analysis
   └─→ Calculate enhanced scores
   ↓
5. Return comprehensive analysis
```

### 3. Performance Considerations

#### Caching Strategy
- Cache codebase analysis results for 24 hours
- Use repository commit SHA as cache key
- Invalidate cache on new commits

#### Analysis Time Limits
- **Quick Analysis**: 5 minutes max
  - Basic complexity scan
  - Dependency check
  - Test coverage (if available)
  
- **Standard Analysis**: 15 minutes max
  - Full complexity analysis
  - Complete test coverage
  - Security scan
  - Architecture analysis
  
- **Deep Analysis**: 30 minutes max
  - All standard analysis
  - Full dependency tree analysis
  - Documentation quality deep dive
  - Design pattern detection

#### Resource Limits
- Maximum repository size: 500MB
- Maximum file count: 10,000 files
- Timeout handling for large repositories
- Graceful degradation if analysis fails

### 4. Error Handling

#### Graceful Degradation
- If codebase analysis fails, fall back to GitHub metrics only
- Log analysis failures for debugging
- Return partial results if some analysis tools fail
- Provide clear error messages to users

#### Error Response Format
```json
{
  "codebase_analysis": {
    "status": "partial",
    "completed_analyses": ["complexity", "dependencies"],
    "failed_analyses": ["test_coverage"],
    "errors": [
      {
        "analysis_type": "test_coverage",
        "error": "No test files found",
        "severity": "warning"
      }
    ]
  }
}
```

## Updated Valuation Formula

### Enhanced Scoring Algorithm

The unicorn score should now consider:

1. **Community Momentum (25%)** - Existing GitHub metrics
2. **Development Velocity (15%)** - Existing commit frequency
3. **Technology Quality (20%)** - ENHANCED with codebase analysis
   - Code quality scores (40%)
   - Architecture quality (30%)
   - Dependency health (30%)
4. **Market Potential (15%)** - Existing stars/forks
5. **Network Effects (10%)** - Existing forks/contributors
6. **Code Quality (10%)** - NEW from codebase analysis
   - Maintainability index (40%)
   - Test coverage (35%)
   - Documentation quality (25%)
7. **Security Posture (5%)** - NEW from dependency analysis

### Example Calculation

```python
def calculate_enhanced_unicorn_score(repo_data, codebase_analysis):
    scores = {
        "community_momentum": calculate_community_score(repo_data) * 0.25,
        "development_velocity": calculate_velocity_score(repo_data) * 0.15,
        "technology_quality": calculate_tech_quality(repo_data, codebase_analysis) * 0.20,
        "market_potential": calculate_market_score(repo_data) * 0.15,
        "network_effects": calculate_network_score(repo_data) * 0.10,
        "code_quality": calculate_code_quality_score(codebase_analysis) * 0.10,
        "security_posture": calculate_security_score(codebase_analysis) * 0.05
    }
    
    return sum(scores.values())
```

## API Response Format

### Complete Response Structure

```json
{
  "method": "unicorn_hunter",
  "unicorn_score": 88.2,
  "status": "🚀 Soaring! ($500M+ potential)",
  "tier": "soaring",
  "component_scores": {
    "community_momentum": 91.2,
    "development_velocity": 62.1,
    "technology_quality": 90.0,
    "market_potential": 100,
    "network_effects": 100,
    "code_quality": 78.5,
    "maintainability": 72.0,
    "test_reliability": 82.3,
    "security_posture": 88.0
  },
  "codebase_analysis": {
    "code_complexity": { /* ... */ },
    "quality_scores": { /* ... */ },
    "test_coverage": { /* ... */ },
    "dependencies": { /* ... */ },
    "architecture": { /* ... */ },
    "documentation": { /* ... */ },
    "technology_stack": { /* ... */ }
  },
  "speculative_valuation_ranges": {
    "conservative": 3793157.64,
    "realistic": 7305861.97,
    "optimistic": 14071553.11,
    "maximum_cap": 1000000000,
    "currency": "USD"
  },
  "interpretation": {
    "score_meaning": "Score of 88.2/100 indicates 🚀 soaring! ($500m+ potential)",
    "valuation_note": "These are speculative estimates based on GitHub metrics and codebase analysis. Code quality score: 78.5/100. Test coverage: 82.3%. Security vulnerabilities: 0 critical.",
    "factors_considered": [
      "community_momentum",
      "development_velocity",
      "technology_quality",
      "market_potential",
      "network_effects",
      "code_quality",
      "maintainability",
      "test_reliability",
      "security_posture"
    ]
  }
}
```

## Frontend Updates Required

### New UI Components Needed

1. **Codebase Analysis Section**
   - Display code quality metrics
   - Show test coverage visualization
   - Display dependency health
   - Architecture diagram/visualization

2. **Enhanced Component Scores**
   - Add new score categories
   - Visual indicators for code quality
   - Security posture badge

3. **Analysis Status Indicator**
   - Show analysis progress
   - Indicate analysis depth (quick/standard/deep)
   - Display analysis timestamp

## Testing Requirements

### Test Cases

1. **Repository with no tests** - Should handle gracefully
2. **Repository with high complexity** - Should reflect in scores
3. **Repository with security vulnerabilities** - Should lower security score
4. **Large repository (>500MB)** - Should timeout gracefully
5. **Private repository** - Should handle access errors
6. **Multi-language repository** - Should analyze all languages
7. **Repository with no dependencies** - Should handle edge case

## Success Metrics

### Quality Indicators

- Analysis completes successfully for 95%+ of repositories
- Average analysis time < 15 minutes for standard analysis
- Code quality scores correlate with maintainability
- Security scores accurately reflect dependency vulnerabilities
- Test coverage scores match actual coverage

## Timeline & Phases

### Phase 1: Basic Code Analysis (Week 1-2)
- Implement complexity analysis
- Add dependency security scanning
- Integrate with existing MCP tools

### Phase 2: Test & Quality Analysis (Week 3-4)
- Add test coverage analysis
- Implement quality scoring
- Add maintainability metrics

### Phase 3: Architecture & Documentation (Week 5-6)
- Architecture analysis
- Documentation evaluation
- Design pattern detection

### Phase 4: Integration & Polish (Week 7-8)
- Full integration with unicorn_hunter
- Frontend updates
- Performance optimization
- Testing & bug fixes

## Notes for Developer

- Use LangChain's tool calling capabilities for orchestration
- Leverage existing MCP server infrastructure
- Consider using GitHub Actions or similar for code analysis (can be faster)
- Cache aggressively to reduce API costs
- Monitor analysis times and optimize slow tools
- Consider offering analysis as a premium feature for deep analysis

---

**Version**: 1.0  
**Last Updated**: 2025-01-17  
**Author**: Unicorn Hunter Team

